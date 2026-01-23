/**
 * Settings Page - Security, Sync and Preferences
 */
import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { AuthService } from '../services/AuthService.js';
import { DriveService } from '../services/DriveService.js';
import { ns } from '../utils/notifications.js';

export function renderSettingsPage() {
    const isBioEnabled = AuthService.isBioEnabled();
    const hasCloudSync = DriveService.hasToken();

    return `
    <div class="settings-page stagger-children">
        <header class="page-header">
            <h1 class="page-title">Configuración</h1>
            <p class="page-subtitle">Privacidad, Seguridad y Sincronización</p>
        </header>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${getIcon('shield', 'section-icon')} Seguridad
            </h2>
            
            <div class="card premium-settings-card">
                <div class="settings-item-row">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Huella Dactilar / Biometría</div>
                        <div class="settings-item-desc">Desbloqueo rápido y seguro sin contraseña.</div>
                    </div>
                    <label class="switch-premium">
                        <input type="checkbox" id="toggle-bio" ${isBioEnabled ? 'checked' : ''}>
                        <span class="slider-premium round"></span>
                    </label>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="change-password-link">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Contraseña Maestra</div>
                        <div class="settings-item-desc">Cambiar la clave de acceso de tu bóveda local.</div>
                    </div>
                    <div class="settings-action-icon">${getIcon('chevronRight')}</div>
                </div>
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${getIcon('cloud', 'section-icon')} Nube & Sincronización
            </h2>
            
            <div class="card premium-settings-card">
                <div class="settings-item-row">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Google Drive</div>
                        <div class="settings-item-desc">${hasCloudSync ? '<span class="status-badge connected">Conectado</span>' : '<span class="status-badge disconnected">No conectado</span>'} Sincroniza tu bóveda encriptada.</div>
                    </div>
                    <button class="btn-settings-action ${hasCloudSync ? 'active' : ''}" id="sync-drive-btn">
                        ${hasCloudSync ? getIcon('refreshCw') : getIcon('link')}
                        <span>${hasCloudSync ? 'Sincronizar' : 'Conectar'}</span>
                    </button>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="import-backup-btn">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Importar Backup Manual</div>
                        <div class="settings-item-desc">Restaurar desde archivo .bin exportado.</div>
                    </div>
                    <div class="settings-action-icon">${getIcon('upload')}</div>
                </div>
                <input type="file" id="import-backup-input" accept=".bin" style="display: none;">

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="export-data-btn">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Exportar Backup Manual</div>
                        <div class="settings-item-desc">Descargar archivo encriptado (.bin) para seguridad externa.</div>
                    </div>
                    <div class="settings-action-icon">${getIcon('download')}</div>
                </div>
            </div>

            <div class="settings-note">
                ${getIcon('lock', 'note-icon')} Todos tus datos se encriptan localmente con AES-256-GCM antes de ser enviados a tu Google Drive personal. Nadie más tiene acceso.
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${getIcon('settings', 'section-icon')} Aplicación
            </h2>
            <div class="card premium-settings-card">
                <div class="settings-item-row clickable" id="btn-logout">
                    <div class="settings-item-info">
                        <div class="settings-item-label" style="color: var(--accent-danger);">Cerrar Sesión</div>
                        <div class="settings-item-desc">Bloquear acceso y limpiar llaves de sesión.</div>
                    </div>
                    <div class="settings-action-icon" style="color: var(--accent-danger);">${getIcon('logOut')}</div>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="btn-force-update">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Forzar Actualización</div>
                        <div class="settings-item-desc">Recargar la última versión de la App (limpia caché).</div>
                    </div>
                    <div class="settings-action-icon">${getIcon('refreshCw')}</div>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-item-row clickable" id="btn-factory-reset">
                    <div class="settings-item-info">
                        <div class="settings-item-label" style="color: var(--accent-danger);">Borrar todos los datos</div>
                        <div class="settings-item-desc">Elimina permanentemente el almacenamiento local y reinicia la App.</div>
                    </div>
                    <div class="settings-action-icon" style="color: var(--accent-danger);">${getIcon('trash')}</div>
                </div>
            </div>
        </section>

        <section class="settings-section">
            <h2 class="settings-section-title">
                ${getIcon('zap', 'section-icon')} Inteligencia Artificial
            </h2>
            <div class="card premium-settings-card">
                <div class="settings-item-row" style="cursor: default;">
                    <div class="settings-item-info">
                        <div class="settings-item-label">Gemini API Key</div>
                        <div class="settings-item-desc">Necesaria para el análisis de comida con IA real.</div>
                        <div style="margin-top: var(--spacing-sm); display: flex; gap: var(--spacing-sm);">
                            <input type="password" id="gemini-api-key" class="form-input" 
                                placeholder="Tu API Key de Google AI" 
                                value="${localStorage.getItem('life-dashboard/db_gemini_api_key') || ''}"
                                style="border-radius: var(--radius-sm); font-size: 13px;">
                            <button class="btn btn-primary" id="btn-save-gemini" style="padding: 0 16px; min-width: auto; height: 38px;">
                                Guardar
                            </button>
                        </div>
                        <p style="font-size: 10px; color: var(--text-muted); margin-top: 8px;">
                            Consigue tu llave gratis en <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--accent-primary);">Google AI Studio</a>.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <footer class="settings-footer">
            <p>Life Dashboard Pro v1.0.63</p>
            <p>© 2026 Privacy First Zero-Knowledge System</p>
        </footer>
    </div>
    `;
}

export function setupSettingsListeners() {
    // Biometrics toggle
    document.getElementById('toggle-bio')?.addEventListener('change', async (e) => {
        const enabled = e.target.checked;
        if (enabled) {
            const pass = await ns.prompt('Activar Biometría', 'Introduce tu contraseña maestra para confirmar:', 'Tu contraseña', 'password');
            if (pass) {
                try {
                    await AuthService.registerBiometrics(pass);
                    ns.toast('Biometría activada correctamente');
                } catch (err) {
                    await ns.alert('Error', err.message);
                    e.target.checked = false;
                }
            } else {
                e.target.checked = false;
            }
        } else {
            localStorage.setItem('life-dashboard/db_bio_enabled', 'false');
            ns.toast('Biometría desactivada', 'info');
        }
    });

    // Install App Button
    const installBtn = document.getElementById('btn-install-pwa');
    // Only show if the install prompt event has fired (handled in main.js)
    // On some mobiles, this might fire later or not at all if already installed.
    if (installBtn) {
        // We set a small timeout to check if deferredPrompt is available
        setTimeout(() => {
            if (window.deferredPrompt) {
                const card = document.getElementById('install-pwa-card');
                if (card) card.style.display = 'block';
                installBtn.addEventListener('click', async () => {
                    if (!window.deferredPrompt) return;
                    window.deferredPrompt.prompt();
                    const { outcome } = await window.deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        ns.toast('Instalando aplicación...');
                        const card = document.getElementById('install-pwa-card');
                        if (card) card.style.display = 'none';
                    }
                    window.deferredPrompt = null;
                });
            }
        }, 1000);
    }

    // Cloud Sync (Push/Connect)
    document.getElementById('sync-drive-btn')?.addEventListener('click', async () => {
        const btn = document.getElementById('sync-drive-btn');
        const hasToken = DriveService.hasToken();
        const originalContent = btn.innerHTML;

        try {
            btn.innerHTML = `<div class="loading-spinner-sm"></div>`;
            btn.style.pointerEvents = 'none';

            if (!hasToken) {
                // Initial connection logic
                await DriveService.authenticate();

                // Check if file exists before pushing
                const vaultKey = AuthService.getVaultKey();
                const remoteState = await DriveService.pullData(vaultKey).catch(() => null);

                if (remoteState) {
                    const choice = await ns.confirm(
                        'Respaldo Encontrado',
                        'Hemos detectado una bóveda existente en Google Drive. ¿Qué deseas hacer con tus datos?',
                        'Recuperar de la Nube',
                        'Sobreescribir Nube'
                    );

                    if (choice) {
                        // User chose "Recuperar de la Nube" (Primary)
                        store.setState(remoteState);
                        // Force save before reload
                        await store.saveState();
                        ns.toast('Datos recuperados correctamente');
                        setTimeout(() => window.location.reload(), 800);
                        return;
                    }
                }

                // If they chose to overwrite (choice === false) or no remote found
                await DriveService.pushData(store.getState(), vaultKey);
                ns.toast('Google Drive conectado y sincronizado');
            } else {
                // Simple manually triggered Sync (Push)
                const vaultKey = AuthService.getVaultKey();
                await DriveService.pushData(store.getState(), vaultKey);
                ns.toast('Bóveda actualizada en Drive');
            }

            if (typeof window.reRender === 'function') window.reRender();
        } catch (e) {
            console.error(e);

            // Handle decryption failure specifically
            if (e.message && (e.message.includes('Contraseña incorrecta') || e.message.includes('corruptos'))) {
                const deleteRemote = await ns.confirm(
                    'Error de Decifrado',
                    'La contraseña actual no coincide con la del backup en la nube. ¿Deseas borrar los datos en Drive para empezar de cero?',
                    'Borrar Datos Nube',
                    'Cancelar'
                );

                if (deleteRemote) {
                    try {
                        await DriveService.deleteBackup();
                        ns.toast('Datos de Drive borrados');
                        // Retry push
                        const vaultKey = AuthService.getVaultKey();
                        await DriveService.pushData(store.getState(), vaultKey);
                        ns.toast('Google Drive sincronizado (Nueva Bóveda)');
                    } catch (err) {
                        ns.alert('Error', 'No se pudieron borrar los datos de Drive.');
                    }
                }
            } else {
                ns.alert('Error', e.message || (typeof e === 'object' ? JSON.stringify(e) : 'Error al conectar con Google'));
            }
        } finally {
            btn.innerHTML = originalContent;
            btn.style.pointerEvents = 'auto';
        }
    });

    // Manual Export Backup
    document.getElementById('export-data-btn')?.addEventListener('click', async () => {
        try {
            ns.toast('Preparando archivo encriptado...', 'info');
            const state = store.getState();
            const vaultKey = AuthService.getVaultKey();

            const { SecurityService } = await import('../services/SecurityService.js');
            const encryptedData = await SecurityService.encrypt(state, vaultKey);

            const blob = new Blob([JSON.stringify(encryptedData)], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            a.href = url;
            a.download = `life_dashboard_backup_${date}.bin`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            ns.toast('Backup exportado correctamente');
        } catch (err) {
            console.error('Export error:', err);
            ns.alert('Error de Exportación', 'No se pudieron encriptar o descargar los datos.');
        }
    });

    // Import Backup Manual
    const importBtn = document.getElementById('import-backup-btn');
    const importInput = document.getElementById('import-backup-input');

    importBtn?.addEventListener('click', () => {
        importInput?.click();
    });

    importInput?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const confirmImport = await ns.confirm(
            '¿Importar Backup?',
            'Esto sobreescribirá todos tus datos locales con los del archivo. ¿Deseas continuar?'
        );
        if (!confirmImport) {
            importInput.value = '';
            return;
        }

        try {
            const text = await file.text();
            const encryptedData = JSON.parse(text);
            const vaultKey = AuthService.getVaultKey();

            // Decrypt using SecurityService
            const { SecurityService } = await import('../services/SecurityService.js');
            const decryptedState = await SecurityService.decrypt(encryptedData, vaultKey);

            if (decryptedState) {
                store.setState(decryptedState);
                await store.saveState();
                ns.toast('Backup importado correctamente');
                setTimeout(() => window.location.reload(), 1000);
            } else {
                throw new Error('No se pudo descifrar el archivo');
            }
        } catch (err) {
            console.error('Import error:', err);
            ns.alert('Error de Importación', 'El archivo no es válido o la contraseña no coincide con la usada para el backup.');
        } finally {
            importInput.value = '';
        }
    });

    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', async () => {
        const confirmLogout = await ns.confirm('¿Cerrar sesión?', 'El acceso quedará bloqueado hasta que introduzcas tu clave.');
        if (confirmLogout) {
            AuthService.logout();
            window.location.reload();
        }
    });

    // Force Update
    document.getElementById('btn-force-update')?.addEventListener('click', async () => {
        const confirmed = await ns.confirm('¿Forzar Actualización?', 'Esto recargará la página y limpiará la caché para obtener la última versión.');
        if (confirmed) {
            if (window.caches) {
                // Try to clear caches
                try {
                    const names = await caches.keys();
                    for (let name of names) await caches.delete(name);
                } catch (e) {
                    console.error('Error clearing cache', e);
                }
            }
            // Force reload from server
            window.location.reload(true);
        }
    });

    // Gemini API Key Save
    document.getElementById('btn-save-gemini')?.addEventListener('click', () => {
        const key = document.getElementById('gemini-api-key')?.value;
        if (key !== undefined) {
            localStorage.setItem('life-dashboard/db_gemini_api_key', key.trim());
            ns.toast('API Key de Gemini guardada');
        }
    });

    // Factory Reset
    document.getElementById('btn-factory-reset')?.addEventListener('click', async () => {
        const confirmed = await ns.hardConfirm('Borrar todos los datos', 'Esta acción eliminará permanentemente todos tus activos, ingresos, agenda y configuraciones de este dispositivo.', 'BORRAR');

        if (confirmed) {
            // Clear only app specific keys
            const prefix = 'life-dashboard/';

            // LocalStorage
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(prefix)) localStorage.removeItem(key);
            });

            // SessionStorage
            Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith(prefix)) sessionStorage.removeItem(key);
            });

            // Clear IndexedDB
            if (window.indexedDB.databases) {
                const dbs = await window.indexedDB.databases();
                dbs.forEach(db => window.indexedDB.deleteDatabase(db.name));
            }

            // Clear Service Workers
            if (navigator.serviceWorker) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    registration.unregister();
                }
            }

            ns.toast('Aplicación reseteada', 'info');
            setTimeout(() => {
                window.location.href = window.location.origin + '?reset=' + Date.now();
            }, 1000);
        }
    });
}
