/**
 * Google Drive Service - Handles encrypted synchronization with the cloud using CLIENT_ID.
 */
import { SecurityService } from './SecurityService.js';

const CLIENT_ID = '974464877836-721dprai6taijtuufmrkh438q68e97sp.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export class DriveService {
    static tokenClient = null;
    static accessToken = sessionStorage.getItem('drive_access_token') || null;

    /**
     * Returns true if we have an active access token
     */
    static hasToken() {
        return !!this.accessToken;
    }


    /**
     * Initializes Google API client and Token Client
     */
    static async init() {
        return new Promise((resolve) => {
            const checkGapi = () => {
                if (window.gapi && window.google) {
                    gapi.load('client', async () => {
                        await gapi.client.init({
                            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                        });

                        this.tokenClient = google.accounts.oauth2.initTokenClient({
                            client_id: CLIENT_ID,
                            scope: SCOPES,
                            callback: (resp) => {
                                if (resp.error) throw resp;
                                this.accessToken = resp.access_token;
                                resolve(true);
                            },
                        });
                        resolve(true);
                    });
                } else {
                    setTimeout(checkGapi, 100);
                }
            };
            checkGapi();
        });
    }

    /**
     * Requests a fresh token from user
     */
    static async authenticate() {
        if (!this.tokenClient) await this.init();
        return new Promise((resolve, reject) => {
            this.tokenClient.callback = (resp) => {
                if (resp.error) reject(resp);
                this.accessToken = resp.access_token;
                sessionStorage.setItem('drive_access_token', resp.access_token);
                resolve(resp.access_token);
            };
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        });
    }

    /**
     * Gets or creates a nested folder structure
     */
    static async getOrCreateFolderPath(path) {
        // Ensure client is initialized before using Drive API
        if (!gapi.client?.drive) {
            await this.init();
        }

        const parts = path.split('/').filter(p => p);
        let parentId = 'root';

        for (const part of parts) {
            const q = `name = '${part}' and mimeType = 'application/vnd.google-apps.folder' and '${parentId}' in parents and trashed = false`;
            const resp = await gapi.client.drive.files.list({ q, fields: 'files(id, name)' });
            const folders = resp.result.files;

            if (folders.length > 0) {
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
    static async pushData(state, vaultKey) {
        try {
            if (!this.accessToken) throw new Error('Cloud not connected');

            console.log('[Drive] Pushing full encrypted data...');
            const folderId = await this.getOrCreateFolderPath('/backup/life-dashboard/');
            const encrypted = await SecurityService.encrypt(state, vaultKey);

            const fileName = 'dashboard_vault_v5.bin';
            const q = `name = '${fileName}' and '${folderId}' in parents and trashed = false`;
            const listResp = await gapi.client.drive.files.list({ q, fields: 'files(id)' });
            const existingFiles = listResp.result.files;

            const blob = new Blob([JSON.stringify(encrypted)], { type: 'application/json' });

            if (existingFiles.length > 0) {
                const fileId = existingFiles[0].id;
                const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${this.accessToken}` },
                    body: blob
                });
                if (!response.ok) throw new Error(`Drive update failed: ${response.status}`);
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
                if (!response.ok) throw new Error(`Drive creation failed: ${response.status}`);
            }
            return true;
        } catch (e) {
            console.error('[Drive] Push failed:', e);
            throw e;
        }
    }

    /**
     * Pulls encrypted state from Drive
     */
    static async pullData(vaultKey) {
        try {
            if (!this.accessToken) throw new Error('Cloud not connected');

            // Ensure client is initialized before using Drive API
            if (!gapi.client?.drive) {
                await this.init();
            }

            console.log('[Drive] Pulling data...');
            const folderId = await this.getOrCreateFolderPath('/backup/life-dashboard/');
            const fileName = 'dashboard_vault_v5.bin';
            const q = `name = '${fileName}' and '${folderId}' in parents and trashed = false`;
            const listResp = await gapi.client.drive.files.list({ q, fields: 'files(id, name)' });
            const existingFiles = listResp.result.files;

            if (existingFiles.length === 0) return null;

            const fileId = existingFiles[0].id;
            const resp = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });

            const encryptedData = await resp.json();
            return await SecurityService.decrypt(encryptedData, vaultKey);
        } catch (e) {
            console.error('[Drive] Pull failed:', e);
            throw e;
        }
    }

    /**
     * Deletes the backup file from Google Drive
     */
    static async deleteBackup() {
        try {
            if (!this.accessToken) throw new Error('Cloud not connected');
            if (!gapi.client?.drive) await this.init();

            const folderId = await this.getOrCreateFolderPath('/backup/life-dashboard/');
            const fileName = 'dashboard_vault_v5.bin';
            const q = `name = '${fileName}' and '${folderId}' in parents and trashed = false`;
            const listResp = await gapi.client.drive.files.list({ q, fields: 'files(id)' });
            const existingFiles = listResp.result.files;

            if (existingFiles.length > 0) {
                const fileId = existingFiles[0].id;
                await gapi.client.drive.files.delete({ fileId });
                console.log('[Drive] Backup deleted successfully');
                return true;
            }
            return false;
        } catch (e) {
            console.error('[Drive] Deletion failed:', e);
            throw e;
        }
    }
}
