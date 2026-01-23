/**
 * Health Page - Fitness, Nutrition and Body Metrics
 */
import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';
import { GeminiService } from '../services/GeminiService.js';

export function renderHealthPage() {
    const state = store.getState();
    const { health } = state;

    return `
    <div class="health-page stagger-children" style="padding-bottom: 100px;">
      <header class="page-header">
        <h1 class="page-title">Salud y Forma Física</h1>
        <p class="page-subtitle">Rendimiento, métricas y nutrición</p>
      </header>

      <!-- FITNESS ROUTINES -->
      <div class="section-divider">
        <span class="section-title">Programas de Entrenamiento</span>
      </div>

      <div class="routines-grid">
        ${health.routines.map((routine, ridx) => `
          <div class="card health-routine-card" style="margin-bottom: var(--spacing-lg);">
            <header class="routine-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="routine-icon-circle" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        ${getIcon('zap')}
                    </div>
                    <h3 class="routine-name clickable rename-routine" data-id="${routine.id}" data-current="${routine.name}">${routine.name}</h3>
                </div>
                <div class="routine-actions">
                    <button class="reorder-routine-btn" data-index="${ridx}" data-dir="up">${getIcon('chevronUp')}</button>
                    <button class="reorder-routine-btn" data-index="${ridx}" data-dir="down">${getIcon('chevronDown')}</button>
                    <button class="delete-routine-btn" data-id="${routine.id}">${getIcon('trash')}</button>
                </div>
            </header>

            <div class="exercise-list-health">
                ${routine.exercises.map((ex, exIdx) => {
        const status = store.getExerciseStatus(routine.id, exIdx);
        const colorVar = `var(--accent-${status.color})`;
        const isDoneToday = status.status === 'done_today';
        let ratingDisplay = '';
        if (status.lastLog && status.lastLog.rating) {
            ratingDisplay = `<span style="font-size: 10px; color: var(--accent-tertiary);">★ ${status.lastLog.rating}</span>`;
        }

        return `
                    <div class="exercise-item-health ${isDoneToday ? 'exercise-done' : ''}">
                        <div class="ex-health-main">
                            <div class="exercise-status-dot" style="width: 8px; height: 8px; border-radius: 50%; background-color: ${colorVar}; box-shadow: 0 0 6px ${colorVar};"></div>
                            <div class="ex-health-info">
                                <div class="ex-health-name-row">
                                    <span class="ex-health-name clickable rename-exercise" data-routine="${routine.id}" data-index="${exIdx}" data-current="${ex.name}">${ex.name}</span>
                                    <div class="ex-reorder-btns">
                                        <button class="reorder-ex-btn" data-routine="${routine.id}" data-index="${exIdx}" data-dir="up">${getIcon('chevronUp')}</button>
                                        <button class="reorder-ex-btn" data-routine="${routine.id}" data-index="${exIdx}" data-dir="down">${getIcon('chevronDown')}</button>
                                    </div>
                                </div>
                                <div class="ex-health-stats">
                                    <span class="ex-clickable-val update-weight" data-routine="${routine.id}" data-index="${exIdx}">${ex.weight || 50}kg</span>
                                    <span style="opacity: 0.3;">•</span>
                                    <span class="ex-clickable-val update-reps" data-routine="${routine.id}" data-index="${exIdx}">${ex.reps || 10} reps</span>
                                    ${status.lastLog ? `
                                        <span style="opacity: 0.3;">•</span>
                                        <span class="last-effort-badge ${getRatingClass(status.lastLog.rating)}">Último: ${getRatingLabel(status.lastLog.rating)}</span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="ex-health-actions">
                            <button class="delete-exercise-btn ex-delete-mini" data-routine="${routine.id}" data-index="${exIdx}" title="Eliminar">${getIcon('trash')}</button>
                            ${isDoneToday ? `
                                <div class="exercise-done-badge-solid">
                                    ${getIcon('check', 'done-icon-solid')}
                                </div>
                            ` : `
                                <div class="exercise-log-actions">
                                    <button class="btn-perf hard log-ex-rating-btn" data-rid="${routine.id}" data-idx="${exIdx}" data-rating="1">
                                        <span>😰</span> DURO
                                    </button>
                                    <button class="btn-perf good log-ex-rating-btn" data-rid="${routine.id}" data-idx="${exIdx}" data-rating="3">
                                        <span>💪</span> BIEN
                                    </button>
                                    <button class="btn-perf easy log-ex-rating-btn" data-rid="${routine.id}" data-idx="${exIdx}" data-rating="5">
                                        <span>⚡</span> FÁCIL
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                    `;
    }).join('')}
            </div>
            <div class="add-ex-row" style="margin-top: var(--spacing-md);">
                <button class="btn btn-secondary add-ex-btn w-full" data-id="${routine.id}">
                    ${getIcon('plus')} Agregar Ejercicio
                </button>
            </div>
          </div>
        `).join('')}
        
        <div class="add-routine-card-placeholder">
            <button class="btn btn-success add-routine-btn" id="add-routine-btn">
                ${getIcon('plus')} Nueva Rutina
            </button>
        </div>
      </div>

      <!-- METRICS: WEIGHT & FAT -->
      <div class="section-divider">
        <span class="section-title">Métricas de Cuerpo</span>
      </div>

      <div class="summary-grid" style="margin-bottom: var(--spacing-2xl);">
        <div class="summary-item card clickable" id="log-weight-btn">
          <div class="summary-value">${health.weightLogs.length > 0 ? health.weightLogs[health.weightLogs.length - 1].weight : '--'} kg</div>
          <div class="summary-label">Peso Actual</div>
        </div>
        <div class="summary-item card clickable" id="log-fat-btn">
          <div class="summary-value">${health.fatLogs.length > 0 ? (health.fatLogs[health.fatLogs.length - 1].fat || '--') : '--'} %</div>
          <div class="summary-label">Grasa Corporal</div>
        </div>
        <div class="summary-item card clickable" id="set-weight-goal-btn">
          <div class="summary-value">${health.weightGoal} kg</div>
          <div class="summary-label">Objetivo Peso</div>
        </div>
        <div class="summary-item card clickable" id="set-fat-goal-btn">
          <div class="summary-value">${health.fatGoal || '--'} %</div>
          <div class="summary-label">Objetivo Grasa</div>
        </div>
      </div>
      
      <div class="card ai-calorie-card" style="margin-bottom: var(--spacing-2xl); display: flex; flex-direction: column; align-items: center;">
          <div class="summary-value" style="font-size: 28px;">${calculateTodayCalories(health)} kcal</div>
          <div class="summary-label">Calorías Registradas Hoy</div>
          <button class="btn btn-primary" id="ai-scan-photo" style="margin-top: var(--spacing-md); width: auto; padding: 10px 20px;">
             ${getIcon('camera')} Escanear Comida (AI)
          </button>
      </div>

    </div>
    `;
}

function getRatingLabel(rating) {
    if (rating <= 2) return 'DURO';
    if (rating <= 4) return 'BIEN';
    return 'FÁCIL';
}

function getRatingClass(rating) {
    if (rating <= 2) return 'effort-hard';
    if (rating <= 4) return 'effort-good';
    return 'effort-easy';
}

function calculateTodayCalories(health) {
    const today = new Date().toDateString();
    return (health.calorieLogs || [])
        .filter(log => new Date(log.date).toDateString() === today)
        .reduce((sum, log) => sum + (log.calories || 0), 0);
}

export function setupHealthPageListeners() {
    // Add Exercise
    document.querySelectorAll('.add-ex-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const routineId = btn.dataset.id;
            const name = await ns.prompt('Nuevo Ejercicio', 'Nombre del ejercicio:');
            if (name) {
                store.addExerciseToRoutine(routineId, { name });
                ns.toast('Ejercicio añadido');
            }
        });
    });

    // Rename Routine
    document.querySelectorAll('.rename-routine').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.dataset.id;
            const currentName = el.dataset.current;
            const newName = await ns.prompt('Editar Rutina', 'Nombre de la rutina:', currentName);
            if (newName && newName !== currentName) {
                store.renameRoutine(id, newName);
                ns.toast('Rutina renombrada');
            }
        });
    });

    // Delete Routine
    document.querySelectorAll('.delete-routine-btn').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.dataset.id;
            const confirmed = await ns.confirm('¿Borrar Rutina?', 'Esta acción no se puede deshacer.', 'Eliminar', 'Cancelar');
            if (confirmed) {
                store.deleteRoutine(id);
                ns.toast('Rutina eliminada');
            }
        });
    });

    // Rename Exercise
    document.querySelectorAll('.rename-exercise').forEach(el => {
        el.addEventListener('click', async () => {
            const routineId = el.dataset.routine;
            const index = parseInt(el.dataset.index);
            const currentName = el.dataset.current;
            const newName = await ns.prompt('Renombrar Ejercicio', 'Nuevo nombre:', currentName);
            if (newName && newName !== currentName) {
                store.updateExercise(routineId, index, { name: newName });
                ns.toast('Ejercicio renombrado');
            }
        });
    });

    // Delete Exercise
    document.querySelectorAll('.delete-exercise-btn').forEach(el => {
        el.addEventListener('click', async () => {
            const routineId = el.dataset.routine;
            const index = parseInt(el.dataset.index);
            const confirmed = await ns.confirm('Eliminar Ejercicio', '¿Quitar este ejercicio de la rutina?', 'Eliminar', 'Cancelar');
            if (confirmed) {
                store.deleteExerciseFromRoutine(routineId, index);
                ns.toast('Ejercicio eliminado');
            }
        });
    });

    // Reorder Routine
    document.querySelectorAll('.reorder-routine-btn').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(el.dataset.index);
            const dir = el.dataset.dir;
            store.reorderRoutine(index, dir);
        });
    });

    // Reorder Exercise
    document.querySelectorAll('.reorder-ex-btn').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const routineId = el.dataset.routine;
            const index = parseInt(el.dataset.index);
            const dir = el.dataset.dir;
            store.reorderExercise(routineId, index, dir);
        });
    });

    // Update Weight (Select Picker)
    document.querySelectorAll('.update-weight').forEach(el => {
        el.addEventListener('click', async (e) => {
            e.stopPropagation();
            const routineId = el.dataset.routine;
            const index = parseInt(el.dataset.index);

            const options = [];
            for (let kg = 10; kg <= 150; kg += 2.5) {
                options.push(`${kg}kg`);
            }

            const selected = await ns.select('Seleccionar Peso', 'Elige el peso para este ejercicio:', options, 4);
            if (selected) {
                const weight = parseFloat(selected.replace('kg', ''));
                store.updateExercise(routineId, index, { weight });
                ns.toast('Peso actualizado');
            }
        });
    });

    // Update Reps (Select Picker)
    document.querySelectorAll('.update-reps').forEach(el => {
        el.addEventListener('click', async (e) => {
            e.stopPropagation();
            const routineId = el.dataset.routine;
            const index = parseInt(el.dataset.index);

            const options = [];
            for (let r = 7; r <= 20; r++) {
                options.push(`${r} reps`);
            }

            const selected = await ns.select('Seleccionar Reps', 'Elige las repeticiones objetivo:', options, 4);
            if (selected) {
                const reps = parseInt(selected.replace(' reps', ''));
                store.updateExercise(routineId, index, { reps });
                ns.toast('Reps actualizadas');
            }
        });
    });

    // Exercise Logging (Instant Ratings)
    document.querySelectorAll('.log-ex-rating-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const routineId = btn.dataset.rid;
            const index = parseInt(btn.dataset.idx);
            const rating = parseInt(btn.dataset.rating);
            store.logExercise(routineId, index, rating);
            ns.toast('Registrado', 'success', 800);
        });
    });

    // Log weight
    document.getElementById('log-weight-btn')?.addEventListener('click', async () => {
        const weight = await ns.prompt('Registrar Peso', 'Peso actual (kg):');
        if (weight) store.addWeightLog(weight);
    });

    // Log fat
    document.getElementById('log-fat-btn')?.addEventListener('click', async () => {
        const fat = await ns.prompt('Registrar Grasa', 'Porcentaje de grasa (%):');
        if (fat) store.addFatLog(fat);
    });

    // Set weight goal
    document.getElementById('set-weight-goal-btn')?.addEventListener('click', async () => {
        const current = store.getState().health.weightGoal;
        const goal = await ns.prompt('Objetivo de Peso', 'Introduce tu peso ideal (kg):', current);
        if (goal) store.updateHealthGoal('weightGoal', parseFloat(goal));
    });

    // Set fat goal
    document.getElementById('set-fat-goal-btn')?.addEventListener('click', async () => {
        const current = store.getState().health.fatGoal;
        const goal = await ns.prompt('Objetivo de Grasa', 'Introduce tu porcentaje ideal (%):', current);
        if (goal) store.updateHealthGoal('fatGoal', parseFloat(goal));
    });

    // AI Scan Tool
    document.getElementById('ai-scan-photo')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!GeminiService.hasKey()) {
                const setup = await ns.confirm('IA no configurada', 'Añade tu Gemini API Key en Ajustes.', 'Configurar', 'Simulación');
                if (setup) {
                    document.querySelector('[data-nav="settings"]')?.click();
                    return;
                }
                ns.toast('Usando simulación...', 'info');
                runSimulation();
                return;
            }

            try {
                ns.toast('Analizando con Gemini...', 'info');
                const result = await GeminiService.analyzeFood(file);
                const confirmed = await ns.confirm('IA Detectada', `Identificado: "${result.name}" (${result.calories} kcal). ¿Registrar?`);
                if (confirmed) {
                    store.addCalorieLog(result.calories, `${result.name} (AI)`);
                    ns.toast('Calorías registradas');
                }
            } catch (err) {
                ns.alert('Error IA', err.message);
            }
        };

        function runSimulation() {
            setTimeout(async () => {
                const detected = { name: 'Bowl Saludable', cals: 450 };
                const confirmed = await ns.confirm('IA Simulada', `Detectado "${detected.name}" con ${detected.cals} kcal. ¿Registrar?`);
                if (confirmed) {
                    store.addCalorieLog(detected.cals, detected.name);
                    ns.toast('Registrado');
                }
            }, 1000);
        }
        input.click();
    });

    // Add routine
    document.getElementById('add-routine-btn')?.addEventListener('click', async () => {
        const name = await ns.prompt('Nueva Rutina', 'Nombre (ej: Pecho y Triceps):', 'Día X');
        if (name) {
            store.saveRoutine({ name, exercises: [] });
            ns.toast('Rutina creada');
        }
    });
}
