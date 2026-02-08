import { store } from '../store.js';
import { AuthService } from '../services/AuthService.js';
import { DriveService } from '../services/DriveService.js';
import { getIcon } from '../utils/icons.js';
import { renderSettingsPage, setupSettingsListeners } from './SettingsPage.js';
import { renderCalendarPage, setupCalendarPageListeners } from './CalendarPage.js';
import { ns } from '../utils/notifications.js';

export function renderMenuPage() {
    const hasCloudSync = DriveService.hasToken();

    return `
    <div class="stagger-children" style="padding-bottom: 80px;">
        <header class="page-header">
            <h1 class="page-title">Menú</h1>
        </header>

        <div class="menu-grid">
            <button class="menu-card" id="open-calendar">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);">
                    ${getIcon('calendar')}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Agenda</div>
                    <div class="menu-desc">Eventos y recordatorios</div>
                </div>
                <div class="menu-arrow">${getIcon('chevronRight')}</div>
            </button>

            <button class="menu-card" id="open-settings">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);">
                    ${getIcon('settings')}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Ajustes</div>
                    <div class="menu-desc">Configuración general</div>
                </div>
                <div class="menu-arrow">${getIcon('chevronRight')}</div>
            </button>

            ${hasCloudSync ? `
                <button class="menu-card" id="btn-upload-menu">
                    <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);">
                        ${getIcon('uploadCloud')}
                    </div>
                    <div class="menu-info">
                        <div class="menu-title">Subir a la nube</div>
                        <div class="menu-desc">Sincronizar local → Drive</div>
                    </div>
                </button>

                <button class="menu-card" id="btn-download-menu">
                    <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%);">
                        ${getIcon('downloadCloud')}
                    </div>
                    <div class="menu-info">
                        <div class="menu-title">Bajar de la nube</div>
                        <div class="menu-desc">Sincronizar Drive → local</div>
                    </div>
                </button>
            ` : ''}

            <button class="menu-card" id="btn-force-update">
                <div class="menu-icon-wrapper" style="background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);">
                    ${getIcon('refreshCw')}
                </div>
                <div class="menu-info">
                    <div class="menu-title">Forzar Actualización</div>
                    <div class="menu-desc">Recargar la última versión</div>
                </div>
                <div class="menu-arrow">${getIcon('chevronRight')}</div>
            </button>
        </div>
    </div>
    `;
}

export function setupMenuPageListeners(navigateFn) {
    document.getElementById('open-calendar')?.addEventListener('click', () => {
        navigateFn('calendar');
    });

    document.getElementById('open-settings')?.addEventListener('click', () => {
        navigateFn('settings');
    });

    // Upload
    document.getElementById('btn-upload-menu')?.addEventListener('click', async () => {
        const btn = document.getElementById('btn-upload-menu');
        const originalContent = btn.innerHTML;

        try {
            const confirmed = await ns.confirm('Subir a la Nube', 'Esto reemplazará TODO lo que tengas en Google Drive con tus datos locales. ¿Continuar?');
            if (!confirmed) return;

            btn.innerHTML = `<div style="margin: auto;"><div class="loading-spinner-sm"></div></div>`;
            btn.style.pointerEvents = 'none';

            const vaultKey = AuthService.getVaultKey();
            await DriveService.pushData(store.getState(), vaultKey);
            ns.toast('Bóveda subida correctamente');
        } catch (e) {
            console.error(e);
            ns.alert('Error al subir', e.message);
        } finally {
            btn.innerHTML = originalContent;
            btn.style.pointerEvents = 'auto';
        }
    });

    // Download
    document.getElementById('btn-download-menu')?.addEventListener('click', async () => {
        const btn = document.getElementById('btn-download-menu');
        const originalContent = btn.innerHTML;

        try {
            const confirmed = await ns.confirm('Descargar de la Nube', 'Esto reemplazará TODOS tus datos locales con los que hay en la nube. Esta acción no se puede deshacer. ¿Continuar?');
            if (!confirmed) return;

            btn.innerHTML = `<div style="margin: auto;"><div class="loading-spinner-sm"></div></div>`;
            btn.style.pointerEvents = 'none';

            const vaultKey = AuthService.getVaultKey();
            const remoteState = await DriveService.pullData(vaultKey);

            if (remoteState) {
                store.resetState(remoteState);
                await store.saveState();
                ns.toast('Datos descargados correctamente', 'success');
                setTimeout(() => window.location.reload(), 1000);
            } else {
                ns.alert('Error', 'No se encontró una bóveda válida en Drive o el descifrado falló (¿Contraseña incorrecta?)');
            }
        } catch (e) {
            console.error('[Menu] Download failed:', e);
            ns.alert('Error de Descarga', e.message || 'Error desconocido al bajar datos');
        } finally {
            btn.innerHTML = originalContent;
            btn.style.pointerEvents = 'auto';
        }
    });

    document.getElementById('btn-force-update')?.addEventListener('click', async () => {
        const confirmed = await ns.confirm('¿Forzar Actualización?', 'Esto recargará la página y limpiará la caché para obtener la última versión.');
        if (confirmed) {
            if (window.caches) {
                try {
                    const names = await caches.keys();
                    for (let name of names) await caches.delete(name);
                } catch (e) {
                    console.error('Error clearing cache', e);
                }
            }
            window.location.reload(true);
        }
    });
}
