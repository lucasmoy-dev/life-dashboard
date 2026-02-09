
import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

const getLocalDate = (d = new Date()) => {
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

let selectedDate = getLocalDate();

export function renderHabitsPage() {
    const state = store.getState();
    const habits = state.habits || [];
    const habitLogs = state.habitLogs || {};
    const todayLogs = habitLogs[selectedDate] || [];

    // Sort habits by time
    const sortedHabits = [...habits].sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));

    const completionRate = habits.length > 0
        ? Math.round((todayLogs.length / habits.length) * 100)
        : 0;

    return `
    <div class="habits-page stagger-children">
        <header class="page-header">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div>
                    <h1 class="page-title">Habits & Routine</h1>
                    <p class="page-subtitle">Construye tu mejor versión</p>
                </div>
                <div class="date-display-habits">
                    ${formatDisplayDate(selectedDate)}
                </div>
            </div>
        </header>

        <!-- Stats Overview -->
        <div class="card habits-overview-card">
            <div class="habits-progress-info">
                <div class="habits-progress-text">
                    <div class="habits-completion-pct">${completionRate}%</div>
                    <div class="habits-completion-label">Completado hoy</div>
                </div>
                <div class="habits-stats-mini">
                    <div class="mini-stat">
                        <span class="mini-stat-val">${todayLogs.length}</span>
                        <span class="mini-stat-label">Hechos</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-stat-val">${habits.length - todayLogs.length}</span>
                        <span class="mini-stat-label">Pendientes</span>
                    </div>
                </div>
            </div>
            <div class="habits-progress-bar-bg">
                <div class="habits-progress-bar-fill" style="width: ${completionRate}%"></div>
            </div>
        </div>

        <!-- Weekly Strip -->
        <div class="habits-week-strip">
            ${renderWeekStrip()}
        </div>

        <!-- History Stats -->
        <div class="section-divider">
            <span class="section-title">Actividad Reciente</span>
        </div>
        <div class="card habits-history-card">
            ${renderHabitHistory(habitLogs, habits.length)}
        </div>

        <div class="section-divider">
            <span class="section-title">Tu Rutina</span>
            <button class="btn-add-goal-inline" id="btn-add-habit">
                ${getIcon('plus')} Nuevo
            </button>
        </div>

        <div class="habits-list drag-container" id="habits-container">
            ${sortedHabits.length === 0 ? `
                <div class="empty-state">
                    ${getIcon('calendar', 'empty-icon')}
                    <p>No hay hábitos configurados.</p>
                </div>
            ` : sortedHabits.map(h => renderHabitItem(h, todayLogs.includes(h.id))).join('')}
        </div>
    </div>
    `;
}

function renderWeekStrip() {
    const days = [];
    const today = new Date();
    const todayStr = getLocalDate();

    for (let i = -3; i <= 3; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);
        const dateStr = getLocalDate(d);
        const dayShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()];
        const dayNum = d.getDate();

        days.push(`
            <div class="week-day-btn ${dateStr === selectedDate ? 'active' : ''}" data-date="${dateStr}">
                <div class="week-day-name">${dayShort}</div>
                <div class="week-day-num">${dayNum}</div>
                ${dateStr === todayStr ? '<div class="today-dot"></div>' : ''}
            </div>
        `);
    }
    return days.join('');
}

function renderHabitHistory(logs, totalHabits) {
    const days = [];
    const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLogs = logs[dateStr] || [];
        const pct = totalHabits > 0 ? Math.round((dayLogs.length / totalHabits) * 100) : 0;

        days.push({
            name: dayNames[d.getDay()],
            pct,
            isToday: i === 0
        });
    }

    return `
    <div class="habits-history-grid">
        ${days.map(d => `
            <div class="history-day-col">
                <div class="history-bar-container">
                    <div class="history-bar-fill" style="height: ${d.pct}%"></div>
                </div>
                <div class="history-day-label ${d.isToday ? 'active' : ''}">${d.name}</div>
            </div>
        `).join('')}
    </div>
    <div class="history-legend">
        Completitud de los últimos 7 días
    </div>
    `;
}

function renderHabitItem(habit, isCompleted) {
    return `
    <div class="card habit-card draggable-habit ${isCompleted ? 'completed' : ''}" 
         data-id="${habit.id}" 
         draggable="true">
        <div class="habit-check-wrapper" data-id="${habit.id}">
            <div class="habit-checkbox ${isCompleted ? 'checked' : ''}">
                ${isCompleted ? getIcon('check') : ''}
            </div>
        </div>
        <div class="habit-main-info">
            <div style="display: flex; align-items: center; gap: 8px;">
                <div class="habit-icon-circle" style="background: ${habit.color}20; color: ${habit.color}">
                    ${getIcon(habit.icon || 'star')}
                </div>
                <div>
                    <div class="habit-name">${habit.name}</div>
                    <div class="habit-time-label">${habit.time || '--:--'}</div>
                </div>
            </div>
        </div>
        <div class="habit-actions">
            <button class="icon-btn edit-habit" data-id="${habit.id}">${getIcon('edit')}</button>
            <button class="icon-btn delete-habit" data-id="${habit.id}">${getIcon('trash')}</button>
        </div>
    </div>
    `;
}

export function setupHabitsListeners() {
    // Week strip navigation
    document.querySelectorAll('.week-day-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedDate = btn.dataset.date;
            window.reRender?.();
        });
    });

    // Toggle Checkbox
    document.querySelectorAll('.habit-check-wrapper').forEach(check => {
        check.addEventListener('click', (e) => {
            e.stopPropagation();
            const habitId = check.dataset.id;
            store.toggleHabit(habitId, selectedDate);
            // Re-render handled by store change
        });
    });

    // Add Habit
    document.getElementById('btn-add-habit')?.addEventListener('click', () => {
        openHabitModal();
    });

    // Edit Habit
    document.querySelectorAll('.edit-habit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const habit = store.getState().habits.find(h => h.id === id);
            if (habit) openHabitModal(habit);
        });
    });

    // Delete Habit
    document.querySelectorAll('.delete-habit').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const confirmed = await ns.confirm('¿Eliminar hábito?', 'Esta acción no se puede deshacer.');
            if (confirmed) {
                store.deleteHabit(id);
            }
        });
    });

    // Drag and Drop reordering (though we currently sort by time, let's keep it for logic consistency)
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const container = document.getElementById('habits-container');
    if (!container) return;

    let draggedId = null;

    document.querySelectorAll('.draggable-habit').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedId = card.dataset.id;
            card.classList.add('dragging');
            card.style.opacity = '0.4';
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            card.style.opacity = '1';
        });
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        const cards = Array.from(container.querySelectorAll('.draggable-habit'));
        const newHabits = cards.map(c => {
            const id = c.dataset.id;
            return store.getState().habits.find(h => h.id === id);
        });
        store.reorderHabits(newHabits);
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable-habit:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function openHabitModal(habit = null) {
    const isEdit = !!habit;
    const title = isEdit ? 'Editar Hábito' : 'Nuevo Hábito';
    const icons = ['zap', 'brain', 'dumbbell', 'coffee', 'bookOpen', 'heart', 'droplet', 'sun', 'moon', 'star', 'check', 'bell'];
    const colors = ['#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#a855f7', '#6366f1', '#d946ef'];

    let selectedIcon = habit?.icon || 'zap';
    let selectedColor = habit?.color || '#3b82f6';

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active overlay-centered';
    modal.innerHTML = `
        <div class="modal animate-pop-in" style="width: 100%; max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="close-modal-btn">${getIcon('x')}</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Nombre</label>
                    <input type="text" id="habit-name" class="form-input" placeholder="Ej: Levantarse, Meditar..." value="${habit?.name || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Hora (Opcional)</label>
                    <input type="time" id="habit-time" class="form-input" value="${habit?.time || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Icono</label>
                    <div class="icon-selection-grid">
                        ${icons.map(icon => `
                            <div class="icon-option ${icon === selectedIcon ? 'selected' : ''}" data-icon="${icon}">
                                ${getIcon(icon)}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Color</label>
                    <div class="color-selection-grid">
                        ${colors.map(color => `
                            <div class="color-option ${color === selectedColor ? 'selected' : ''}" data-color="${color}" style="background: ${color}"></div>
                        `).join('')}
                    </div>
                </div>

                <button class="btn btn-primary" id="save-habit-btn" style="width: 100%; margin-top: var(--spacing-md);">
                    ${isEdit ? 'Guardar Cambios' : 'Crear Hábito'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-modal-btn');
    const saveBtn = modal.querySelector('#save-habit-btn');

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Icon Selection
    modal.querySelectorAll('.icon-option').forEach(opt => {
        opt.addEventListener('click', () => {
            modal.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedIcon = opt.dataset.icon;
        });
    });

    // Color Selection
    modal.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            modal.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedColor = opt.dataset.color;
        });
    });

    saveBtn.addEventListener('click', () => {
        const name = modal.querySelector('#habit-name').value.trim();
        const time = modal.querySelector('#habit-time').value;

        if (!name) {
            ns.toast('El nombre es obligatorio', 'error');
            return;
        }

        const habitData = {
            name,
            time,
            icon: selectedIcon,
            color: selectedColor
        };

        if (isEdit) {
            store.updateHabit(habit.id, habitData);
            ns.toast('Hábito actualizado');
        } else {
            store.addHabit(habitData);
            ns.toast('Hábito creado');
        }

        closeModal();
    });
}

function formatDisplayDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (d.getTime() === today.getTime()) return 'Hoy';

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return d.toLocaleDateString('es-ES', options);
}

export function openHabitModalShortcut() {
    openHabitModal();
}
