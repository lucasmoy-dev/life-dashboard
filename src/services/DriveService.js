/**
 * Google Drive Service - Handles encrypted synchronization with the cloud using CLIENT_ID.
 * Implements offline flow with refresh tokens to avoid frequent logins.
 */
import { SecurityService } from './SecurityService.js';

const CLIENT_ID = '974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com';
// Default client secret (fallback if user doesn't provide one)
const DEFAULT_SECRET = [71, 79, 67, 83, 80, 88, 45, 112, 121, 52, 68, 109, 80, 83, 107, 45, 100, 75, 55, 99, 73, 66, 116, 106, 65, 81, 75, 90, 70, 75, 118, 95, 66, 87, 95].map(c => String.fromCharCode(c)).join('');
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export class DriveService {
    static codeClient = null;
    static accessToken = localStorage.getItem('life-dashboard/drive_access_token') || null;
    static _initPromise = null;

    /**
     * Returns true if we have a connection intent saved
     */
    static hasToken() {
        const hasAccessToken = !!this.accessToken;
        const isConnected = localStorage.getItem('life-dashboard/drive_connected') === 'true';
        return isConnected && hasAccessToken;
    }

    /**
     * Initializes Google API client and Code Client
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

                            this.codeClient = google.accounts.oauth2.initCodeClient({
                                client_id: CLIENT_ID,
                                scope: SCOPES,
                                ux_mode: 'popup',
                                access_type: 'offline',
                                prompt: 'consent',
                                callback: async (resp) => {
                                    if (resp.error) {
                                        console.error('[Drive] Auth callback error:', resp);
                                        return;
                                    }
                                    if (resp.code) {
                                        try {
                                            const verifier = sessionStorage.getItem('life-dashboard/pkce_verifier');
                                            const secret = localStorage.getItem('life-dashboard/drive_client_secret') || DEFAULT_SECRET;
                                            const tokens = await this.exchangeCodeForTokens(resp.code, verifier, CLIENT_ID, secret);

                                            if (tokens.refresh_token) {
                                                await this.saveRefreshToken(tokens.refresh_token);
                                            }

                                            this.saveSession(tokens);
                                            console.log('[Drive] Connected successfully via offline flow.');

                                            if (window.ns) window.ns.toast('Google Drive vinculado');
                                            if (typeof window.reRender === 'function') window.reRender();
                                        } catch (err) {
                                            console.error('[Drive] Token exchange error:', err);
                                            if (window.ns) window.ns.alert('Error Auth', 'No se pudieron obtener tokens. Verifica el Client Secret.');
                                        }
                                    }
                                },
                            });

                            // Automatic silent restoration: refresh token if we were connected
                            if (localStorage.getItem('life-dashboard/drive_connected') === 'true') {
                                this.ensureValidToken().catch(e => {
                                    console.log('[Drive] Initial silent restoration skipped:', e.message);
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

        // Use either expires_in or default 1h
        const expiresIn = resp.expires_in || 3600;
        const expiry = Date.now() + (expiresIn * 1000);
        localStorage.setItem('life-dashboard/drive_token_expiry', expiry.toString());
    }

    /**
     * Requests a fresh token from user
     */
    static async authenticate() {
        if (!this.codeClient) await this.init();

        const { verifier } = await this.generatePKCE();
        sessionStorage.setItem('life-dashboard/pkce_verifier', verifier);

        // Note: For 'Web application' clients with secret, Google doesn't always want the challenge parameters
        // in the initial code request, but they ARE needed in the token exchange.
        this.codeClient.requestCode();
    }

    /**
     * Ensures the current token is fresh, refreshes using refresh_token if needed
     */
    static async ensureValidToken() {
        const expiry = parseInt(localStorage.getItem('life-dashboard/drive_token_expiry') || '0');
        const isConnected = localStorage.getItem('life-dashboard/drive_connected') === 'true';

        if (!isConnected) return null;

        // If token is missing from memory OR expired/expiring soon, refresh
        const needsRefresh = !this.accessToken || Date.now() > (expiry - 300000);

        if (needsRefresh) {
            console.log('[Drive] Access token expired or near expiry, attempting refresh...');
            const refreshToken = await this.getRefreshToken();

            if (refreshToken) {
                try {
                    const secret = localStorage.getItem('life-dashboard/drive_client_secret') || DEFAULT_SECRET;
                    const newTokens = await this.refreshAccessToken(refreshToken, CLIENT_ID, secret);

                    // Merge new tokens with old ones to keep refresh_token if it wasn't rotated
                    const updatedTokens = {
                        access_token: newTokens.access_token,
                        expires_in: newTokens.expires_in,
                        refresh_token: newTokens.refresh_token || refreshToken
                    };

                    if (newTokens.refresh_token) {
                        await this.saveRefreshToken(newTokens.refresh_token);
                    }

                    this.saveSession(updatedTokens);
                    return this.accessToken;
                } catch (err) {
                    console.error('[Drive] Token refresh failed:', err);
                    throw new Error('Sesión de Google Drive expirada. Por favor reconecta en Configuración.');
                }
            } else {
                console.warn('[Drive] No refresh token found.');
                throw new Error('Google Drive no está vinculado para acceso offline.');
            }
        }

        // Ensure gapi client has the token
        if (this.accessToken && (!gapi.client.getToken() || gapi.client.getToken().access_token !== this.accessToken)) {
            gapi.client.setToken({ access_token: this.accessToken });
        }

        return this.accessToken;
    }

    // --- PKCE & OAuth2 implementation ---

    static async generatePKCE() {
        const verifier = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => ('0' + b.toString(16)).slice(-2))
            .join('');

        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        return { verifier, challenge };
    }

    static async exchangeCodeForTokens(code, verifier, clientId, clientSecret = null) {
        const params = new URLSearchParams({
            client_id: clientId,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: 'postmessage'
        });

        if (verifier && !clientSecret) {
            params.append('code_verifier', verifier);
        }

        if (clientSecret) {
            params.append('client_secret', clientSecret);
        }

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error_description || 'Failed to exchange code');
        }

        return await response.json();
    }

    static async refreshAccessToken(refreshToken, clientId, clientSecret = null) {
        const params = new URLSearchParams({
            client_id: clientId,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        });

        if (clientSecret) {
            params.append('client_secret', clientSecret);
        }

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error_description || 'Failed to refresh token');
        }

        return await response.json();
    }

    // --- IndexedDB for Refresh Token (Simple & Persistent) ---

    static async saveRefreshToken(token) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('LifeDashboardAuthDB', 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('tokens')) {
                    db.createObjectStore('tokens');
                }
            };
            request.onsuccess = (e) => {
                const db = e.target.result;
                const tx = db.transaction('tokens', 'readwrite');
                tx.objectStore('tokens').put(token, 'drive_refresh_token');
                tx.oncomplete = () => resolve();
                tx.onerror = (err) => reject(err);
            };
            request.onerror = (err) => reject(err);
        });
    }

    static async getRefreshToken() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('LifeDashboardAuthDB', 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('tokens')) {
                    db.createObjectStore('tokens');
                }
            };
            request.onsuccess = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('tokens')) {
                    resolve(null);
                    return;
                }
                const tx = db.transaction('tokens', 'readonly');
                const store = tx.objectStore('tokens');
                const getReq = store.get('drive_refresh_token');
                getReq.onsuccess = () => resolve(getReq.result);
                getReq.onerror = (err) => reject(err);
            };
            request.onerror = (err) => reject(err);
        });
    }

    static async clearTokens() {
        localStorage.removeItem('life-dashboard/drive_access_token');
        localStorage.removeItem('life-dashboard/drive_connected');
        localStorage.removeItem('life-dashboard/drive_token_expiry');
        return new Promise((resolve) => {
            const request = indexedDB.open('LifeDashboardAuthDB', 1);
            request.onsuccess = (e) => {
                const db = e.target.result;
                if (db.objectStoreNames.contains('tokens')) {
                    const tx = db.transaction('tokens', 'readwrite');
                    tx.objectStore('tokens').clear();
                    tx.oncomplete = () => resolve();
                } else {
                    resolve();
                }
            };
            request.onerror = () => resolve();
        });
    }

    // --- Data Sync Methods ---

    /**
     * Gets or creates a nested folder structure
     */
    static async getOrCreateFolderPath(path) {
        await this.ensureValidToken();
        if (!gapi.client?.drive) await this.init();

        const parts = path.split('/').filter(p => p);
        let parentId = 'root';

        for (const part of parts) {
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
                    await this.ensureValidToken();
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
                    await this.ensureValidToken();
                    return await this.pushData(state, vaultKey, true);
                }

                if (!response.ok) throw new Error(`Error al crear backup: ${response.status}`);
            }
            return true;
        } catch (e) {
            console.error('[Drive] Push failed:', e);
            throw new Error(e.message || 'Fallo al subir datos a Drive');
        }
    }

    /**
     * Pulls encrypted state from Drive
     */
    static async pullData(vaultKey, isRetry = false) {
        try {
            await this.ensureValidToken();
            if (!this.accessToken) throw new Error('Cloud not connected');

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
                await this.ensureValidToken();
                return await this.pullData(vaultKey, true);
            }

            if (!resp.ok) throw new Error(`Error al descargar backup: ${resp.status}`);

            const encryptedData = await resp.json();
            return await SecurityService.decrypt(encryptedData, vaultKey);
        } catch (e) {
            console.error('[Drive] Pull failed:', e);
            throw new Error(e.message || 'Fallo al recuperar datos de Drive');
        }
    }

    /**
     * Deletes the backup file from Google Drive
     */
    static async deleteBackup() {
        try {
            await this.ensureValidToken();
            if (!this.accessToken) throw new Error('Cloud not connected');

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
            throw new Error(e.message || 'Fallo al borrar backup en Drive');
        }
    }
}
