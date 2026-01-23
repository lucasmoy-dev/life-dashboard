/**
 * Google Drive Service - Handles encrypted synchronization with the cloud using CLIENT_ID.
 */
import { SecurityService } from './SecurityService.js';

const CLIENT_ID = '974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export class DriveService {
    static tokenClient = null;
    static accessToken = localStorage.getItem('life-dashboard/drive_access_token') || null;

    /**
     * Returns true if we have a connection intent saved
     */
    static hasToken() {
        return !!this.accessToken && localStorage.getItem('life-dashboard/drive_connected') === 'true';
    }

    /**
     * Initializes Google API client and Token Client
     */
    static async init() {
        if (this._initPromise) return this._initPromise;

        this._initPromise = new Promise((resolve, reject) => {
            const checkGapi = () => {
                if (window.gapi && window.google) {
                    gapi.load('client', async () => {
                        try {
                            await gapi.client.init({
                                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                            });

                            this.tokenClient = google.accounts.oauth2.initTokenClient({
                                client_id: CLIENT_ID,
                                scope: SCOPES,
                                callback: (resp) => {
                                    if (resp.error) {
                                        console.error('[Drive] Auth callback error:', resp);
                                        return;
                                    }
                                    this.saveSession(resp);
                                },
                            });

                            // Silent restoration: If we were connected, try to get a fresh token silently
                            if (localStorage.getItem('life-dashboard/drive_connected') === 'true') {
                                console.log('[Drive] Initial check: Attempting silent token restoration...');
                                this.authenticate(true).catch(() => {
                                    console.log('[Drive] Initial silent restoration skipped (expired or no session)');
                                });
                            }

                            resolve(true);
                        } catch (err) {
                            console.error('[Drive] Init error:', err);
                            reject(err);
                        }
                    });
                } else {
                    setTimeout(checkGapi, 200);
                }
            };
            checkGapi();
        });
        return this._initPromise;
    }

    /**
     * Internal helper to save session data
     */
    static saveSession(resp) {
        this.accessToken = resp.access_token;
        gapi.client.setToken({ access_token: resp.access_token });
        localStorage.setItem('life-dashboard/drive_access_token', resp.access_token);
        localStorage.setItem('life-dashboard/drive_connected', 'true');
        // Set expiry (default 1h = 3600s)
        const expiry = Date.now() + (resp.expires_in ? resp.expires_in * 1000 : 3600000);
        localStorage.setItem('life-dashboard/drive_token_expiry', expiry.toString());
    }

    /**
     * Requests a fresh token from user (interactive or silent)
     */
    static async authenticate(silent = false) {
        if (!this.tokenClient) await this.init();

        return new Promise((resolve, reject) => {
            this.tokenClient.callback = (resp) => {
                if (resp.error) {
                    if (silent) {
                        localStorage.setItem('life-dashboard/drive_connected', 'false');
                        reject(new Error('Silent auth failed'));
                    } else {
                        reject(new Error(resp.error_description || 'Fallo en la autenticación'));
                    }
                    return;
                }
                this.saveSession(resp);
                resolve(resp.access_token);
            };

            if (silent) {
                this.tokenClient.requestAccessToken({ prompt: 'none' });
            } else {
                this.tokenClient.requestAccessToken({ prompt: 'consent' });
            }
        });
    }

    /**
     * Ensures the current token is fresh, refreshes silently if needed
     */
    static async ensureValidToken() {
        const expiry = parseInt(localStorage.getItem('life-dashboard/drive_token_expiry') || '0');
        const isConnected = localStorage.getItem('life-dashboard/drive_connected') === 'true';

        if (!isConnected) return null;
        if (!this.tokenClient) await this.init();

        // If token is missing from memory OR expired/expiring soon, refresh
        const needsRefresh = !this.accessToken || Date.now() > (expiry - 300000);

        if (needsRefresh) {
            console.log('[Drive] Refreshing token silently...');
            try {
                return await this.authenticate(true);
            } catch (e) {
                console.warn('[Drive] Silent refresh failed:', e.message);
                // We DON'T set drive_connected=false here yet,
                // we only do that if the user explicitly disconnects or a critical error occurs.
                // This keeps the "connection intent" alive for next time.
                throw new Error('Google Drive session expired. Click "Sync" in settings to reconnect.');
            }
        }
        return this.accessToken;
    }

    /**
     * Gets or creates a nested folder structure
     */
    static async getOrCreateFolderPath(path) {
        await this.ensureValidToken();
        if (!gapi.client?.drive) await this.init();

        const parts = path.split('/').filter(p => p);
        let parentId = 'root';

        for (const part of parts) {
            try {
                const q = `name = '${part}' and mimeType = 'application/vnd.google-apps.folder' and '${parentId}' in parents and trashed = false`;
                const resp = await gapi.client.drive.files.list({ q, fields: 'files(id, name)' });
                const folders = resp.result.files;

                if (folders && folders.length > 0) {
                    parentId = folders[0].id;
                } else {
                    const folderMetadata = {
                        name: part,
                        mimeType: 'application/vnd.google-apps.folder',
                        parents: [parentId]
                    };
                    const createResp = await gapi.client.drive.files.create({
                        resource: folderMetadata,
                        fields: 'id'
                    });
                    parentId = createResp.result.id;
                }
            } catch (e) {
                if (e.status === 401) {
                    console.log('[Drive] 401 error, attempting auto-reconnect...');
                    try {
                        await this.authenticate(true);
                        // Retry loop could be here, but for now we just throw so the parent can retry if needed
                        throw new Error('RETRY');
                    } catch (authErr) {
                        this.accessToken = null;
                        throw new Error('Sesión de Google expirada. Por favor reconecta.');
                    }
                }
                throw e;
            }
        }
        return parentId;
    }

    /**
     * Uploads encrypted state to Drive
     */
    static async pushData(state, vaultKey, isRetry = false) {
        try {
            await this.ensureValidToken();
            if (!this.accessToken) throw new Error('Cloud not connected');
            if (!gapi.client?.drive) await this.init();
            gapi.client.setToken({ access_token: this.accessToken });

            console.log(`[Drive] Pushing encrypted data...${isRetry ? ' (Retry)' : ''}`);
            const folderId = await this.getOrCreateFolderPath('/backup/life-dashboard/');
            const encrypted = await SecurityService.encrypt(state, vaultKey);

            const fileName = 'dashboard_vault_v5.bin';
            const q = `name = '${fileName}' and '${folderId}' in parents and trashed = false`;
            const listResp = await gapi.client.drive.files.list({ q, fields: 'files(id)' });
            const existingFiles = listResp.result.files;

            const blob = new Blob([JSON.stringify(encrypted)], { type: 'application/json' });

            if (existingFiles && existingFiles.length > 0) {
                const fileId = existingFiles[0].id;
                const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${this.accessToken}` },
                    body: blob
                });

                if (response.status === 401 && !isRetry) {
                    await this.authenticate(true);
                    return await this.pushData(state, vaultKey, true);
                }

                if (!response.ok) throw new Error(`Error al actualizar backup: ${response.status}`);
            } else {
                const metadata = { name: fileName, parents: [folderId] };
                const form = new FormData();
                form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                form.append('file', blob);

                const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${this.accessToken}` },
                    body: form
                });

                if (response.status === 401 && !isRetry) {
                    await this.authenticate(true);
                    return await this.pushData(state, vaultKey, true);
                }

                if (!response.ok) throw new Error(`Error al crear backup: ${response.status}`);
            }
            return true;
        } catch (e) {
            if (e.message === 'RETRY' && !isRetry) {
                return await this.pushData(state, vaultKey, true);
            }
            console.error('[Drive] Push failed:', e);
            throw new Error(e.result?.error?.message || e.message || 'Fallo al subir datos a Drive');
        }
    }

    /**
     * Pulls encrypted state from Drive
     */
    static async pullData(vaultKey, isRetry = false) {
        try {
            await this.ensureValidToken();
            if (!this.accessToken) throw new Error('Cloud not connected');
            if (!gapi.client?.drive) await this.init();
            gapi.client.setToken({ access_token: this.accessToken });

            console.log(`[Drive] Pulling data...${isRetry ? ' (Retry)' : ''}`);
            const folderId = await this.getOrCreateFolderPath('/backup/life-dashboard/');
            const fileName = 'dashboard_vault_v5.bin';
            const q = `name = '${fileName}' and '${folderId}' in parents and trashed = false`;
            const listResp = await gapi.client.drive.files.list({ q, fields: 'files(id, name)' });
            const existingFiles = listResp.result.files;

            if (!existingFiles || existingFiles.length === 0) return null;

            const fileId = existingFiles[0].id;
            const resp = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });

            if (resp.status === 401 && !isRetry) {
                await this.authenticate(true);
                return await this.pullData(vaultKey, true);
            }

            if (!resp.ok) throw new Error(`Error al descargar backup: ${resp.status}`);

            const encryptedData = await resp.json();
            return await SecurityService.decrypt(encryptedData, vaultKey);
        } catch (e) {
            if (e.message === 'RETRY' && !isRetry) {
                return await this.pullData(vaultKey, true);
            }
            console.error('[Drive] Pull failed:', e);
            throw new Error(e.result?.error?.message || e.message || 'Fallo al recuperar datos de Drive');
        }
    }

    /**
     * Deletes the backup file from Google Drive
     */
    static async deleteBackup() {
        try {
            await this.ensureValidToken();
            if (!this.accessToken) throw new Error('Cloud not connected');
            if (!gapi.client?.drive) await this.init();
            gapi.client.setToken({ access_token: this.accessToken });

            const folderId = await this.getOrCreateFolderPath('/backup/life-dashboard/');
            const fileName = 'dashboard_vault_v5.bin';
            const q = `name = '${fileName}' and '${folderId}' in parents and trashed = false`;
            const listResp = await gapi.client.drive.files.list({ q, fields: 'files(id)' });
            const existingFiles = listResp.result.files;

            if (existingFiles && existingFiles.length > 0) {
                const fileId = existingFiles[0].id;
                await gapi.client.drive.files.delete({ fileId });
                console.log('[Drive] Backup deleted successfully');
                return true;
            }
            return false;
        } catch (e) {
            console.error('[Drive] Deletion failed:', e);
            throw new Error(e.result?.error?.message || e.message || 'Fallo al borrar backup en Drive');
        }
    }
}
