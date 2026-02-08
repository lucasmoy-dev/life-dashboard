import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

export function renderSchedulePage() {
    const state = store.getState();
    const scheduledTasks = state.scheduledTasks || [];

    return `
    <div class="schedule-page stagger-children" style="padding-bottom: 80px;">
        <header class="page-header">
            <h1 class="page-title">Programación</h1>
            <p class="page-subtitle">Tareas recurrentes y programadas</p>
        </header>

        <div class="schedule-actions" style="margin-bottom: var(--spacing-xl);">
            <button class="btn btn-primary w-full" id="add-scheduled-task-btn">
                ${getIcon('plus')} Programar Nueva Tarea
            </button>
        </div>

        <div class="scheduled-tasks-list">
            ${scheduledTasks.length === 0 ? `
                <div class="empty-state">
                    ${getIcon('calendar', 'empty-icon')}
                    <div class="empty-title">Sin tareas programadas</div>
                    <p class="empty-description">Programa tareas recurrentes o para fechas futuras.</p>
                </div>
            ` : scheduledTasks.map(task => renderScheduledTaskCard(task)).join('')}
        </div>
    </div>
    `;
}

function renderScheduledTaskCard(task) {
    const frequencyLabel = getFrequencyLabel(task);
    const color = task.color || 'var(--accent-primary)';

    return `
    <div class="card schedule-card ${!task.active ? 'is-inactive' : ''}" 
         style="border-left: 4px solid ${color}; margin-bottom: var(--spacing-md); background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px);">
        <div class="schedule-card-body" style="padding: 16px; display: flex; align-items: center; gap: 16px;">
            <div class="schedule-type-icon" style="background: ${color}22; color: ${color}; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${getIcon(task.type === 'weekly' ? 'refreshCw' : (task.type === 'monthly' ? 'calendar' : 'pin'))}
            </div>
            <div class="schedule-info" style="flex: 1;">
                <div class="schedule-title" style="color: ${color}; font-weight: 700; font-size: 16px;">${task.title}</div>
                <div class="schedule-meta" style="margin-top: 4px;">
                    <span class="schedule-frequency" style="background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px;">${frequencyLabel}</span>
                    ${task.lastProcessed ? `<span class="schedule-last" style="opacity: 0.5; font-size: 10px;">Visto: ${task.lastProcessed}</span>` : ''}
                </div>
            </div>
            <div class="schedule-actions" style="display: flex; gap: 8px;">
                <button class="icon-btn toggle-schedule" data-id="${task.id}" style="color: ${task.active ? 'var(--accent-success)' : 'var(--text-muted)'}; opacity: 1;">
                    ${getIcon(task.active ? 'checkCircle' : 'circle')}
                </button>
                <button class="icon-btn delete-schedule" data-id="${task.id}" style="opacity: 0.4;">
                    ${getIcon('trash')}
                </button>
            </div>
        </div>
    </div>
    `;
}

function getFrequencyLabel(task) {
    if (task.type === 'fixed') return `Fecha: ${task.date}`;
    if (task.type === 'monthly') return `Día ${task.dayOfMonth} de cada mes`;
    if (task.type === 'weekly') {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return `Cada ${task.days.map(d => days[d]).join(', ')}`;
    }
    return 'Desconocido';
}

export function setupScheduleListeners() {
    // Add Scheduled Task
    document.getElementById('add-scheduled-task-btn')?.addEventListener('click', async () => {
        const title = await ns.prompt('Programar Tarea', '¿Qué quieres automatizar?');
        if (!title) return;

        const options = [
            { value: 'weekly', label: '📅 Semanal (Elegir días)' },
            { value: 'monthly', label: '🗓️ Mensual (Día fijo)' },
            { value: 'fixed', label: '📌 Fecha Concreta' }
        ];

        const type = await ns.select('Tipo de Repetición', '¿Cómo se repite esta tarea?', options, 1);
        if (!type) return;

        let taskData = { title, type };

        if (type === 'weekly') {
            const weekdays = [
                { value: '1', label: 'Lunes' },
                { value: '2', label: 'Martes' },
                { value: '3', label: 'Miércoles' },
                { value: '4', label: 'Jueves' },
                { value: '5', label: 'Viernes' },
                { value: '6', label: 'Sábado' },
                { value: '0', label: 'Domingo' }
            ];

            // For simplicity in the prompt, let's use multiple prompts or a custom logic.
            // But since ns.select only allows one choice, I'll allow selecting one day first, 
            // then we could expand it. Or just ask for a comma-separated list? 
            // Better: select one day, and we ask if they want more.
            // Actually, let's use a prompt that asks for numbers 1-7.
            const daysStr = await ns.prompt('Días de la semana', 'Introduce los días (1=Lun, 7=Dom) separados por coma:', '1,4');
            if (!daysStr) return;
            const days = daysStr.split(',').map(d => {
                let val = parseInt(d.trim());
                if (val === 7) return 0; // Sunday
                return val;
            }).filter(d => !isNaN(d));
            taskData.days = days;
        } else if (type === 'monthly') {
            const day = await ns.prompt('Día del mes', 'Día (1-31):', '1', 'number');
            if (!day) return;
            taskData.dayOfMonth = parseInt(day);
        } else if (type === 'fixed') {
            const date = await ns.prompt('Fecha Concreta', '¿Cuándo?', new Date().toISOString().split('T')[0], 'date');
            if (!date) return;
            taskData.date = date;
        }

        const colors = [
            { value: '#00D4AA', label: 'Teal' },
            { value: '#7C3AED', label: 'Purple' },
            { value: '#F59E0B', label: 'Orange' },
            { value: '#EF4444', label: 'Red' },
            { value: '#3B82F6', label: 'Blue' }
        ];
        const color = await ns.select('Color', 'Elige un color:', colors, 3);
        taskData.color = color || '#00D4AA';

        store.addScheduledTask(taskData);
        ns.toast('Tarea programada');
    });

    // Delete
    document.querySelectorAll('.delete-schedule').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const confirmed = await ns.confirm('Eliminar Programación', '¿Seguro que quieres quitar esta automatización?');
            if (confirmed) {
                store.deleteScheduledTask(id);
                ns.toast('Eliminado');
            }
        });
    });

    // Toggle active
    document.querySelectorAll('.toggle-schedule').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const task = store.getState().scheduledTasks.find(t => t.id === id);
            store.updateScheduledTask(id, { active: !task.active });
        });
    });
}
