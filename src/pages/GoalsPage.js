/**
 * Goals Page - Task and Objective Management
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

const GOAL_COLORS = [
    '#ffffff', // Default
    '#00D4AA', // Teal
    '#7C3AED', // Purple
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#10B981', // Green
    '#A855F7', // Magenta
    '#64748B'  // Muted
];

export function renderGoalsPage() {
    const state = store.getState();
    const { goals } = state;

    const timeframes = [
        { id: 'day', label: 'Today', icon: 'zap', color: '#FFD700' },
        { id: 'week', label: 'This Week', icon: 'calendar', color: '#00D4AA' },
        { id: 'year', label: 'Year 2026', icon: 'target', color: '#7C3AED' },
        { id: 'long', label: 'Long Term', icon: 'trendingUp', color: '#EF4444' }
    ];

    return `
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Goals & Focus</h1>
        <p class="page-subtitle">Organiza tus prioridades con colores y objetivos dinámicos</p>
      </header>

      <div class="goals-grid-layout">
        ${timeframes.map(tf => {
        const timeframeGoals = goals.filter(g => g.timeframe === tf.id);
        const completedCount = timeframeGoals.filter(g => g.completed).length;
        const total = timeframeGoals.length;
        const progress = total > 0 ? (completedCount / total) * 100 : 0;

        return `
          <div class="goals-column-premium">
            <div class="goals-column-header-premium" style="--tf-color: ${tf.color}">
                <div class="column-header-main">
                    <div class="column-icon" style="background: ${tf.color}22; color: ${tf.color}">${getIcon(tf.icon)}</div>
                    <div class="column-info">
                        <span class="column-title">${tf.label}</span>
                        <span class="column-stats">${completedCount}/${total}</span>
                    </div>
                    ${completedCount > 0 ? `
                        <button class="btn-clear-completed" data-tf="${tf.id}" title="Limpiar completadas">
                            ${getIcon('trash')}
                        </button>
                    ` : ''}
                </div>
                <div class="column-progress-bar">
                    <div class="column-progress-fill" style="width: ${progress}%; background: ${tf.color}"></div>
                </div>
            </div>
            
            <div class="goals-scroll-area">
                <div class="goals-list-premium" data-timeframe="${tf.id}">
                    ${renderGoalsForTimeframe(timeframeGoals, tf.id)}
                </div>
            </div>

            <div class="column-footer">
                <div class="quick-add-goal-premium">
                    <input type="text" class="quick-add-input-premium" placeholder="Nueva meta..." data-timeframe="${tf.id}">
                    <button class="btn-quick-add-submit" data-timeframe="${tf.id}">
                        ${getIcon('plus')}
                    </button>
                </div>
            </div>
          </div>
        `;
    }).join('')}
      </div>
    </div>
  `;
}

function renderGoalsForTimeframe(filtered, timeframe) {
    if (filtered.length === 0) {
        return `
            <div class="empty-column-state">
                <div class="empty-column-icon" style="opacity: 0.2">${getIcon('package')}</div>
            </div>
        `;
    }

    const sorted = [...filtered].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
        return (b.createdAt || 0) - (a.createdAt || 0);
    });

    return sorted.map(goal => {
        const hasSubgoals = goal.subGoals && goal.subGoals.length > 0;
        const subProgress = hasSubgoals ?
            (goal.subGoals.filter(s => s.completed).length / goal.subGoals.length) * 100 : 0;
        const goalColor = goal.color || '#ffffff';

        return `
        <div class="goal-card-premium ${goal.completed ? 'is-completed' : ''}" 
             data-id="${goal.id}" 
             draggable="true"
             style="border-left: 4px solid ${goalColor};">
            <div class="goal-card-body">
                <div class="goal-checkbox-premium toggle-goal" data-id="${goal.id}" style="border-color: ${goalColor}aa; background: ${goal.completed ? goalColor : 'transparent'}">
                    ${goal.completed ? getIcon('check', 'check-icon-white') : ''}
                </div>
                <div class="goal-main-content">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <div class="goal-title-premium clickable-edit-goal" 
                             data-id="${goal.id}" 
                             style="color: ${goalColor}; font-weight: 700; flex: 1;">${goal.title}</div>
                        <button class="open-color-picker" data-id="${goal.id}" 
                                style="width: 14px; height: 14px; background: ${goalColor}; border: 1px solid rgba(255,255,255,0.2); border-radius: 3px; cursor: pointer; flex-shrink: 0; margin-top: 4px;" 
                                title="Cambiar color"></button>
                    </div>
                    
                    <div class="goal-header-row" style="margin-top: 4px;">
                        <div class="goal-actions-mini">
                            <button class="action-btn-mini add-subgoal" data-id="${goal.id}" title="Hito">${getIcon('plus')}</button>
                            <button class="action-btn-mini delete-goal" data-id="${goal.id}" title="Borrar">${getIcon('trash')}</button>
                        </div>
                    </div>
                    
                    ${hasSubgoals ? `
                        <div class="subgoals-list-premium">
                            ${goal.subGoals.map((sub, idx) => `
                                <div class="subgoal-item-premium ${sub.completed ? 'sub-done' : ''} toggle-subgoal" data-id="${goal.id}" data-idx="${idx}">
                                    <div class="sub-check" style="color: ${goalColor}">${getIcon(sub.completed ? 'check' : 'plus', 'sub-check-svg')}</div>
                                    <span class="sub-title" style="color: ${goalColor}ee">${sub.title}</span>
                                </div>
                            `).join('')}
                            <div class="sub-progress-mini">
                                <div class="sub-progress-fill" style="width: ${subProgress}%; background: ${goalColor}"></div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="goal-color-dots color-selector-overlay hidden" id="colors-${goal.id}">
                        ${GOAL_COLORS.map(c => `
                            <div class="goal-color-dot ${c === goalColor ? 'active' : ''} set-goal-color" 
                                 data-id="${goal.id}" 
                                 data-color="${c}"
                                 style="background: ${c}"></div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

export function setupGoalsPageListeners() {
    // Clear completed goals
    document.querySelectorAll('.btn-clear-completed').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const timeframe = btn.dataset.tf;
            const confirmed = await ns.confirm('Limpiar completadas', '¿Borrar todas las metas ya terminadas de esta columna?');
            if (confirmed) {
                store.deleteCompletedGoals(timeframe);
                ns.toast('Metas limpiadas');
            }
        });
    });

    // Toggle main goal
    document.querySelectorAll('.toggle-goal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            store.toggleGoal(id);
        });
    });

    // Open color picker
    document.querySelectorAll('.open-color-picker').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const overlay = document.getElementById(`colors-${id}`);
            document.querySelectorAll('.color-selector-overlay').forEach(ov => {
                if (ov.id !== `colors-${id}`) ov.classList.add('hidden');
            });
            overlay?.classList.toggle('hidden');
        });
    });

    // Color selection
    document.querySelectorAll('.set-goal-color').forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = dot.dataset.id;
            const color = dot.dataset.color;
            store.updateGoalColor(id, color);
            ns.toast('Color aplicado');
        });
    });

    // Toggle subgoal
    document.querySelectorAll('.toggle-subgoal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const idx = parseInt(btn.dataset.idx);
            store.toggleSubGoal(id, idx);
        });
    });

    // Delete goal
    document.querySelectorAll('.delete-goal').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const confirmed = await ns.confirm('Eliminar Meta', '¿Estás seguro?', 'BORRAR');
            if (confirmed) {
                store.deleteGoal(btn.dataset.id);
                ns.toast('Meta eliminada');
            }
        });
    });

    // Add subgoal
    document.querySelectorAll('.add-subgoal').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const subTitle = await ns.prompt('Nuevo Hito', '¿Qué paso necesitas completar?');
            if (subTitle) {
                const goal = store.getState().goals.find(g => g.id === id);
                const subGoals = [...(goal.subGoals || []), { title: subTitle, completed: false }];
                store.updateGoal(id, { subGoals });
                ns.toast('Paso añadido');
            }
        });
    });

    // Edit goal title
    document.querySelectorAll('.clickable-edit-goal').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.dataset.id;
            const current = el.textContent;
            const newTitle = await ns.prompt('Editar Meta', 'Actualiza el texto:', current);
            if (newTitle && newTitle !== current) {
                store.updateGoal(id, { title: newTitle });
            }
        });
    });

    // Quick Add (Enter Key)
    document.querySelectorAll('.quick-add-input-premium').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                const timeframe = input.dataset.timeframe;
                store.addGoal({
                    title: input.value.trim(),
                    timeframe,
                    color: GOAL_COLORS[0]
                });
                input.value = '';
                ns.toast('Creada');
            }
        });
    });

    // Quick Add (Submit Button)
    document.querySelectorAll('.btn-quick-add-submit').forEach(btn => {
        btn.addEventListener('click', () => {
            const timeframe = btn.dataset.timeframe;
            const input = btn.previousElementSibling;
            if (input && input.value.trim()) {
                store.addGoal({
                    title: input.value.trim(),
                    timeframe,
                    color: GOAL_COLORS[0]
                });
                input.value = '';
                ns.toast('Creada');
            } else if (input) {
                input.focus();
            }
        });
    });

    // Drag and Drop Logic
    const lists = document.querySelectorAll('.goals-list-premium');
    let draggedId = null;

    document.querySelectorAll('.goal-card-premium').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedId = card.dataset.id;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            document.querySelectorAll('.goals-list-premium').forEach(l => l.classList.remove('drag-over'));
        });
    });

    lists.forEach(list => {
        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            list.classList.add('drag-over');
            e.dataTransfer.dropEffect = 'move';
        });

        list.addEventListener('dragleave', () => {
            list.classList.remove('drag-over');
        });

        list.addEventListener('drop', (e) => {
            e.preventDefault();
            list.classList.remove('drag-over');

            const targetTimeframe = list.dataset.timeframe;
            const allGoals = [...store.getState().goals];
            const draggedGoalIndex = allGoals.findIndex(g => g.id === draggedId);
            if (draggedGoalIndex === -1) return;

            const draggedGoal = { ...allGoals[draggedGoalIndex] };
            if (draggedGoal.timeframe !== targetTimeframe) {
                draggedGoal.timeframe = targetTimeframe;
            }

            allGoals.splice(draggedGoalIndex, 1);
            const afterElement = getDragAfterElement(list, e.clientY);
            if (afterElement == null) {
                allGoals.push(draggedGoal);
            } else {
                const targetId = afterElement.dataset.id;
                const targetIdx = allGoals.findIndex(g => g.id === targetId);
                allGoals.splice(targetIdx, 0, draggedGoal);
            }

            const updatedGoals = allGoals.map((g, i) => ({ ...g, order: i }));
            store.reorderGoals(updatedGoals);
            ns.toast('Orden actualizado');
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.goal-card-premium:not(.dragging)')];
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
}
