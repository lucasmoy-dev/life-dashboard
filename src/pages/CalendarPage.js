/**
 * Calendar Page - Agenda and Appointments
 */
import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

let viewDate = new Date();

export function renderCalendarPage() {
    const state = store.getState();
    const { events } = state;

    return `
    <div class="calendar-page stagger-children" style="padding-bottom: 100px;">
      <header class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 class="page-title">Agenda</h1>
            <p class="page-subtitle">Gestiona tus eventos y recordatorios</p>
        </div>
        <button class="btn btn-primary" id="add-event-manual-btn" style="width: auto; padding: 10px 20px;">
            ${getIcon('plus')} Nuevo Evento
        </button>
      </header>

      <div class="calendar-top-layout">
        <!-- CALENDAR VIEW -->
        <div class="card calendar-view-card">
            <div class="calendar-mini-header">
                <button class="icon-btn-navigation prev-month">${getIcon('chevronLeft')}</button>
                <span class="current-month">${getCurrentMonthName()}</span>
                <button class="icon-btn-navigation next-month">${getIcon('chevronRight')}</button>
            </div>
            <div class="calendar-grid">
                ${renderCalendarGrid(events)}
            </div>
        </div>

        <div class="events-list-container" style="margin-top: var(--spacing-xl);">
            <div class="section-divider">
                <span class="section-title">Próximos Eventos</span>
            </div>
            <div class="events-list">
                ${events.length === 0 ? `
                    <div class="empty-state">
                        ${getIcon('calendar', 'empty-icon')}
                        <p class="empty-description">No tienes eventos programados aún.</p>
                    </div>
                ` : events
            .filter(e => {
                const d = new Date(e.date);
                return d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(event => `
                    <div class="card event-card">
                        <div class="event-icon-wrapper ${event.category || 'event'}">
                            ${getIcon(getEventIcon(event.category || 'event'))}
                        </div>
                        <div class="event-main-col" style="flex: 1;">
                            <div class="event-title" style="font-weight: 700;">${event.title}</div>
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
      </div>
    </div>
  `;
}

function renderCalendarGrid(events) {
    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();
    const currentDay = new Date().getDate();
    const isTodayInThisView = new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

    // Create a map of days that have events
    const eventDays = new Set();
    events.forEach(e => {
        const d = new Date(e.date);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            eventDays.add(d.getDate());
        }
    });

    let html = days.map(d => `<div class="calendar-day-label">${d}</div>`).join('');

    // Fill padding for previous month
    for (let p = 0; p < firstDayIndex; p++) {
        html += `<div class="calendar-day empty"></div>`;
    }

    // Fill days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = isTodayInThisView && i === currentDay;
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

function getCurrentMonthName() {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
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
    // Nav
    document.querySelector('.prev-month')?.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() - 1);
        if (typeof window.reRender === 'function') window.reRender();
    });

    document.querySelector('.next-month')?.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() + 1);
        if (typeof window.reRender === 'function') window.reRender();
    });

    // Delete
    document.querySelectorAll('.event-delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const confirmed = await ns.confirm('¿Eliminar evento?', '¿Borrar este evento de tu agenda?');
            if (confirmed) {
                store.deleteEvent(btn.dataset.id);
                ns.toast('Evento eliminado');
            }
        });
    });

    // Add Event Manual
    document.getElementById('add-event-manual-btn')?.addEventListener('click', async () => {
        const title = await ns.prompt('Nuevo Evento', 'Título del evento:');
        if (!title) return;

        const date = await ns.prompt('Fecha', 'Formato YYYY-MM-DD:', new Date().toISOString().split('T')[0]);
        if (!date) return;

        const time = await ns.prompt('Hora', 'Formato HH:MM:', '10:00');
        if (!time) return;

        const cats = [
            { value: 'event', label: 'Evento' },
            { value: 'reminder', label: 'Recordatorio' },
            { value: 'meeting', label: 'Reunión' }
        ];
        const category = await ns.select('Categoría', 'Tipo de evento:', cats, 0);

        store.addEvent({ title, date, time, category: category || 'event', repeat: 'none' });
        ns.toast('Evento agendado', 'success');
    });
}
