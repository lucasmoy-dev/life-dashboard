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
        { id: 'day', label: 'Hoy', icon: 'zap' },
        { id: 'week', label: 'Esta Semana', icon: 'calendar' },
        { id: 'year', label: 'Objetivos 2026', icon: 'target' },
        { id: 'long', label: 'Largo Plazo', icon: 'trendingUp' }
    ];

    return `
    <div class="goals-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Metas</h1>
        <p class="page-subtitle">Organiza tus objetivos y tareas</p>
      </header>

      ${timeframes.map(tf => `
        <div class="section-divider">
            <span class="section-title">
                ${getIcon(tf.icon, 'section-title-icon')} ${tf.label}
            </span>
            <button class="add-goal-mini" data-timeframe="${tf.id}">
                ${getIcon('plus')}
            </button>
        </div>

        <div class="goals-list" data-timeframe="${tf.id}">
            ${renderGoalsForTimeframe(goals, tf.id)}
        </div>
      `).join('')}

      <div class="card add-goal-card-large" id="add-goal-primary">
          <div class="add-goal-prompt">
              ${getIcon('plus', 'add-icon')}
              <span>Crear nueva meta estratégica</span>
          </div>
      </div>
    </div>
  `;
}

function renderGoalsForTimeframe(goals, timeframe) {
    const filtered = goals.filter(g => g.timeframe === timeframe);

    if (filtered.length === 0) {
        return `<div class="empty-goals">No hay metas para este periodo.</div>`;
    }

    return filtered.map(goal => `
        <div class="card goal-item ${goal.completed ? 'completed' : ''}" data-id="${goal.id}">
            <div class="goal-check">
                <div class="checkbox ${goal.completed ? 'checked' : ''}" data-id="${goal.id}">
                    ${goal.completed ? getIcon('check') : ''}
                </div>
            </div>
            <div class="goal-content">
                <div class="goal-top">
                    <span class="goal-category-tag">${goal.category || 'General'}</span>
                    <button class="goal-delete" data-id="${goal.id}">${getIcon('trash')}</button>
                </div>
                <div class="goal-title">${goal.title}</div>
                ${goal.subGoals && goal.subGoals.length > 0 ? `
                    <div class="subgoals-container">
                        ${goal.subGoals.map(sub => `
                            <div class="subgoal-item ${sub.completed ? 'completed' : ''}">
                                <div class="sub-dot"></div>
                                <span>${sub.title}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

export function setupGoalsPageListeners() {
    // Checkboxes
    document.querySelectorAll('.checkbox').forEach(box => {
        box.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = box.dataset.id;
            store.toggleGoal(id);
        });
    });

    // Delete
    document.querySelectorAll('.goal-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const confirmed = await ns.confirm('¿Eliminar meta?', 'Esta acción no se puede deshacer.');
            if (confirmed) {
                store.deleteGoal(btn.dataset.id);
                ns.toast('Meta eliminada');
            }
        });
    });

    // Add buttons
    document.querySelectorAll('.add-goal-mini, #add-goal-primary').forEach(btn => {
        btn.addEventListener('click', async () => {
            const timeframe = btn.dataset.timeframe || 'day';
            const title = await ns.prompt('Nueva Meta', '¿Cuál es tu objetivo?');
            if (title) {
                // Small delay to let the previous modal finish closing
                setTimeout(async () => {
                    const category = await ns.prompt('Categoría', 'Ej: Salud, Finanzas, Trabajo', 'General');
                    store.addGoal({ title, timeframe, category: category || 'General' });
                    ns.toast('Meta añadida');
                }, 400);
            }
        });
    });
}
