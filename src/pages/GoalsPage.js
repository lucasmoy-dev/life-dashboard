/**
 * Goals Page - Task and Objective Management
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

export function renderGoalsPage() {
    const state = store.getState();
    const { goals } = state;

    const timeframes = [
        { id: 'day', label: 'Hoy', icon: 'zap', color: '#FFD700' },
        { id: 'week', label: 'Semana', icon: 'calendar', color: '#00D4AA' },
        { id: 'year', label: 'Año 2026', icon: 'target', color: '#7C3AED' },
        { id: 'long', label: 'Visión', icon: 'trendingUp', color: '#EF4444' }
    ];

    return `
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Metas y Enfoque</h1>
        <p class="page-subtitle">Construye el futuro un paso a la vez</p>
      </header>

      <div class="goals-grid-layout">
        ${timeframes.map(tf => {
        const timeframeGoals = goals.filter(g => g.timeframe === tf.id);
        const completed = timeframeGoals.filter(g => g.completed).length;
        const total = timeframeGoals.length;
        const progress = total > 0 ? (completed / total) * 100 : 0;

        return `
          <div class="goals-column-premium">
            <div class="goals-column-header-premium" style="--tf-color: ${tf.color}">
                <div class="column-header-main">
                    <div class="column-icon" style="background: ${tf.color}22; color: ${tf.color}">${getIcon(tf.icon)}</div>
                    <div class="column-info">
                        <span class="column-title">${tf.label}</span>
                        <span class="column-stats">${completed}/${total} completado</span>
                    </div>
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
                    <button class="quick-add-plus-btn">${getIcon('plus')}</button>
                    <input type="text" class="quick-add-input-premium" placeholder="Nueva meta..." data-timeframe="${tf.id}">
                </div>
            </div>
          </div>
        `;
    }).join('')}
      </div>

      <div class="advanced-goals-section" style="margin-top: var(--spacing-2xl);">
         <div class="card premium-long-term-card" id="add-goal-primary">
            <div class="premium-card-content">
                <div class="premium-icon-circle">${getIcon('trendingUp')}</div>
                <div class="premium-text">
                    <h3>Visión de Largo Plazo</h3>
                    <p>Crea hitos estratégicos para el futuro lejano</p>
                </div>
                <button class="btn btn-primary btn-round">${getIcon('plus')}</button>
            </div>
         </div>
      </div>
    </div>
  `;
}

function renderGoalsForTimeframe(filtered, timeframe) {
    if (filtered.length === 0) {
        return `
            <div class="empty-column-state">
                <div class="empty-column-icon">${getIcon('package')}</div>
                <p>Sin metas pendientes</p>
            </div>
        `;
    }

    // Sort: uncompleted first, then by date
    const sorted = [...filtered].sort((a, b) => {
        if (a.completed === b.completed) return (b.createdAt || 0) - (a.createdAt || 0);
        return a.completed ? 1 : -1;
    });

    return sorted.map(goal => {
        const hasSubgoals = goal.subGoals && goal.subGoals.length > 0;
        const subProgress = hasSubgoals ?
            (goal.subGoals.filter(s => s.completed).length / goal.subGoals.length) * 100 : 0;

        return `
        <div class="goal-card-premium ${goal.completed ? 'is-completed' : ''}" data-id="${goal.id}">
            <div class="goal-card-body">
                <div class="goal-checkbox-premium toggle-goal" data-id="${goal.id}">
                    ${goal.completed ? getIcon('check', 'check-icon') : ''}
                </div>
                <div class="goal-main-content">
                    <div class="goal-header-row">
                        <span class="goal-category-badge">${goal.category || 'General'}</span>
                        <div class="goal-actions-mini">
                            <button class="action-btn-mini add-subgoal" data-id="${goal.id}" title="Añadir hito">${getIcon('plus')}</button>
                            <button class="action-btn-mini delete-goal" data-id="${goal.id}" title="Eliminar">${getIcon('trash')}</button>
                        </div>
                    </div>
                    <div class="goal-title-premium clickable-edit-goal" data-id="${goal.id}">${goal.title}</div>
                    
                    ${hasSubgoals ? `
                        <div class="subgoals-list-premium">
                            ${goal.subGoals.map((sub, idx) => `
                                <div class="subgoal-item-premium ${sub.completed ? 'sub-done' : ''} toggle-subgoal" data-id="${goal.id}" data-idx="${idx}">
                                    <div class="sub-check">${getIcon(sub.completed ? 'check' : 'plus', 'sub-check-svg')}</div>
                                    <span class="sub-title">${sub.title}</span>
                                </div>
                            `).join('')}
                            <div class="sub-progress-mini">
                                <div class="sub-progress-fill" style="width: ${subProgress}%"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    }).join('');
}

export function setupGoalsPageListeners() {
    // Toggle main goal
    document.querySelectorAll('.toggle-goal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            store.toggleGoal(id);
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
            const confirmed = await ns.confirm('Eliminar Meta', 'Esta acción es permanente.', 'ELIMINAR');
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
            const subTitle = await ns.prompt('Sub-meta', '¿Qué paso necesitas completar?');
            if (subTitle) {
                const goal = store.getState().goals.find(g => g.id === id);
                const subGoals = [...(goal.subGoals || []), { title: subTitle, completed: false }];
                store.updateGoal(id, { subGoals });
                ns.toast('Hito añadido');
            }
        });
    });

    // Edit goal title
    document.querySelectorAll('.clickable-edit-goal').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.dataset.id;
            const current = el.textContent;
            const newTitle = await ns.prompt('Editar Meta', 'Título de la meta:', current);
            if (newTitle && newTitle !== current) {
                store.updateGoal(id, { title: newTitle });
            }
        });
    });

    // Quick Add Listener
    document.querySelectorAll('.quick-add-input-premium').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                const timeframe = input.dataset.timeframe;
                store.addGoal({
                    title: input.value.trim(),
                    timeframe,
                    category: 'Foco'
                });
                input.value = '';
                ns.toast('Meta fijada');
            }
        });
    });

    // Primary ADD button
    document.getElementById('add-goal-primary')?.addEventListener('click', async () => {
        const title = await ns.prompt('Nueva Estrategia', 'Describe tu meta estratégica:');
        if (title) {
            const options = [
                { value: 'day', label: 'Hoy' },
                { value: 'week', label: 'Esta Semana' },
                { value: 'year', label: 'Año 2026' },
                { value: 'long', label: 'Visión / Largo Plazo' }
            ];
            const timeframe = await ns.select('Plazo', '¿Cuándo quieres lograr esto?', options, 2);
            if (timeframe) {
                const categories = ['Vida', 'Finanzas', 'Salud', 'Proyectos', 'Mental'];
                const category = await ns.select('Categoría', '¿A qué área pertenece?', categories, 3);
                store.addGoal({ title, timeframe, category: category || 'General' });
                ns.toast('Meta estratégica guardada', 'success');
            }
        }
    });

    // Quick add focus behavior
    document.querySelectorAll('.quick-add-plus-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.nextElementSibling;
            if (input) input.focus();
        });
    });
}
