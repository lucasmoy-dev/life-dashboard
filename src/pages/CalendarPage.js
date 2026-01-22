/**
 * Calendar Page - Agenda and Appointments
 */
import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

export function renderCalendarPage() {
    const state = store.getState();
    const { events } = state;

    return `
    <div class="calendar-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Agenda</h1>
        <p class="page-subtitle">Gestiona tus eventos y recordatorios</p>
      </header>

      <!-- CALENDAR VIEW -->
      <div class="card calendar-view-card">
          <div class="calendar-mini-header">
              <button class="icon-btn-navigation">${getIcon('chevronLeft')}</button>
              <span class="current-month">Enero 2026</span>
              <button class="icon-btn-navigation">${getIcon('chevronRight')}</button>
          </div>
          <div class="calendar-grid">
              ${renderCalendarGrid(events)}
          </div>
      </div>

      <div class="section-divider">
        <span class="section-title">Próximos Eventos</span>
      </div>

      <div class="events-list">
        ${events.length === 0 ? `
            <div class="empty-state">
                ${getIcon('calendar', 'empty-icon')}
                <p class="empty-description">No tienes eventos programados aún.</p>
                <p style="font-size: 11px; color: var(--text-muted);">Usa el botón + para agregar uno</p>
            </div>
        ` : events.sort((a, b) => new Date(a.date) - new Date(b.date)).map(event => `
            <div class="card event-card">
                <div class="event-icon-wrapper ${event.category || 'event'}">
                    ${getIcon(getEventIcon(event.category || 'event'))}
                </div>
                <div class="event-main-col">
                    <div class="event-title">${event.title}</div>
                    <div class="event-details-row">
                        <span class="event-date-text">${formatDate(event.date)}</span>
                        <span class="event-dot-separator"></span>
                        <span class="event-time-text">${event.time}</span>
                        ${event.repeat !== 'none' ? `<span class="event-repeat-tag">${getRepeatLabel(event.repeat)}</span>` : ''}
                    </div>
                </div>
                <button class="event-delete-btn" data-id="${event.id}">
                    ${getIcon('trash')}
                </button>
            </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCalendarGrid(events) {
    const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const currentDay = new Date().getDate();

    // Create a map of days that have events
    const eventDays = new Set();
    events.forEach(e => {
        const d = new Date(e.date);
        if (d.getMonth() === 0 && d.getFullYear() === 2026) { // Simplified for Jan 2026
            eventDays.add(d.getDate());
        }
    });

    let html = days.map(d => `<div class="calendar-day-label">${d}</div>`).join('');

    // Fill 31 days for January (simplified mapping)
    // Jan 1st 2026 is a Thursday (index 4)
    const firstDayPadding = 4;
    for (let p = 0; p < firstDayPadding; p++) {
        html += `<div class="calendar-day empty"></div>`;
    }

    for (let i = 1; i <= 31; i++) {
        const isToday = i === currentDay;
        const hasEvent = eventDays.has(i);
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
                ${i}
                ${hasEvent ? '<span class="event-dot-indicator"></span>' : ''}
            </div>
        `;
    }

    return html;
}

function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateStr).toLocaleDateString('es-ES', options).toUpperCase();
}

function getEventIcon(category) {
    switch (category) {
        case 'reminder': return 'bell';
        case 'meeting': return 'users';
        default: return 'calendar';
    }
}

function getRepeatLabel(repeat) {
    const labels = {
        daily: 'Diario',
        weekly: 'Semanal',
        monthly: 'Mensual',
        yearly: 'Anual'
    };
    return labels[repeat] || '';
}

export function setupCalendarPageListeners() {
    document.querySelectorAll('.event-delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const confirmed = await ns.confirm('¿Eliminar evento?', '¿Estás seguro de que quieres borrar este evento de tu agenda?');
            if (confirmed) {
                store.deleteEvent(btn.dataset.id);
                ns.toast('Evento eliminado', 'info');
            }
        });
    });
}

