import { getIcon } from '../utils/icons.js';
import { renderSettingsPage, setupSettingsListeners } from './SettingsPage.js';
import { renderCalendarPage, setupCalendarPageListeners } from './CalendarPage.js';
import { ns } from '../utils/notifications.js';

export function renderMenuPage() {
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
