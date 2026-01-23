/**
 * Health Page - Fitness and Wellbeing
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';
import { GeminiService } from '../services/GeminiService.js';

export function renderHealthPage() {
    const state = store.getState();
    const { health } = state;

    return `
    <div class="health-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Salud</h1>
        <p class="page-subtitle">Trackeo de bienestar y fitness</p>
      </header>

      <!-- WORKOUT ROUTINES (TOP) -->
      <div class="section-divider" style="margin-top: 0;">
        <span class="section-title">Rutinas de Entrenamiento</span>
      </div>

      <div class="routines-list">
        ${health.routines.map((routine, rIdx) => `
          <div class="card routine-card">
            <div class="routine-header">
                <div class="routine-info">
                    <div class="routine-name clickable rename-routine" data-id="${routine.id}" data-current="${routine.name}">${routine.name}</div>
                    <div class="routine-meta">
                        ${routine.exercises.length} ejercicios
                        <div class="routine-reorder-btns">
                            <button class="reorder-routine-btn" data-index="${rIdx}" data-dir="up" title="Subir">${getIcon('chevronUp')}</button>
                            <button class="reorder-routine-btn" data-index="${rIdx}" data-dir="down" title="Bajar">${getIcon('chevronDown')}</button>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 4px;">
                    <button class="icon-btn add-exercise-btn" data-id="${routine.id}" title="Agregar ejercicio">
                        ${getIcon('plus')}
                    </button>
                    <button class="icon-btn delete-routine" data-id="${routine.id}" style="color: var(--accent-danger);" title="Eliminar rutina">
                        ${getIcon('trash')}
                    </button>
                </div>
            </div>
            <div class="exercise-list">
                ${routine.exercises.map((ex, exIdx) => {
        const status = store.getExerciseStatus(routine.id, exIdx);
        let colorVar = 'var(--text-muted)';
        if (status.color === 'red') colorVar = 'var(--accent-danger)';
        if (status.color === 'orange') colorVar = 'var(--accent-warning)';
        if (status.color === 'green') colorVar = 'var(--accent-success)';

        const isDoneToday = status.status === 'done_today';
        let ratingDisplay = '';
        if (isDoneToday && status.lastLog) {
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
                                    <span style="opacity: 0.3;">•</span>
                                    <span style="font-size: 11px; font-weight: 500;">4 series</span>
                                    ${ratingDisplay ? `<span style="opacity: 0.3;">•</span> ${ratingDisplay}` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="ex-health-actions">
                            ${isDoneToday ? `
                                <div class="exercise-done-badge-solid">
                                    ${getIcon('check', 'done-icon-solid')}
                                </div>
                            ` : `
                                <button class="delete-exercise-btn" data-routine="${routine.id}" data-index="${exIdx}" title="Eliminar ejercicio">
                                    ${getIcon('x')}
                                </button>
                                <button class="log-exercise-large-btn trigger-exercise-log" 
                                        data-routine="${routine.id}" 
                                        data-index="${exIdx}" 
                                        data-name="${ex.name}"
                                        title="Registrar entrenamiento">
                                    🏋️
                                </button>
                            `}
                        </div>
                    </div>
                    `;
    }).join('')}
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
        <div class="summary-item card">
          <div class="summary-value">${health.weightGoal} kg</div>
          <div class="summary-label">Objetivo Peso</div>
        </div>
        <div class="summary-item card">
          <div class="summary-value">${calculateTodayCalories(health)}</div>
          <div class="summary-label">Kcal Hoy</div>
        </div>
      </div>

      <div class="health-top-layout">
        <!-- GOAL PROGRESS -->
        <div class="card health-goal-card">
          <div class="card-header">
            <span class="card-title">Progreso de Peso</span>
            ${getIcon('target', 'card-icon')}
          </div>
          <div class="burndown-container">
              ${renderBurndownChart(health)}
          </div>
          <div class="goal-stats" style="margin-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.05); padding-top: var(--spacing-sm);">
              <div class="goal-stat">
                  <span class="goal-label">Faltan:</span>
                  <span class="goal-value" style="color: var(--accent-primary); font-weight: 700;">${calculateRemainingWeight(health)} kg</span>
              </div>
          </div>
        </div>

        <!-- AI CALORIE TRACKER -->
        <div class="card ai-calorie-card">
          <div class="card-header">
            <span class="card-title">Analizador de Platos IA</span>
            ${getIcon('zap', 'card-icon', 'style="color: var(--accent-tertiary)"')}
          </div>
          <p class="card-desc">Análisis visual instantáneo de comida con Gemini Flash.</p>
          <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; margin: var(--spacing-lg) 0;">
            <button class="btn btn-primary ai-scan-btn" id="ai-scan-photo" style="width: 100%;">
                ${getIcon('camera')}
                Capturar Comida
            </button>
          </div>
          <div class="calorie-brief" style="text-align: center; font-size: 13px; color: var(--text-muted);">
              Consumo de hoy: <span style="color: var(--text-primary); font-weight: 600;">${calculateTodayCalories(health)} kcal</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderBurndownChart(health) {
    const logs = health.weightLogs;
    if (logs.length < 2) {
        return `<div class="empty-chart-msg">Registra al menos 2 pesos para ver el gráfico.</div>`;
    }

    return `
        <div class="simple-chart-placeholder">
            <svg viewBox="0 0 100 40" class="burndown-line" preserveAspectRatio="none">
                <line x1="0" y1="35" x2="100" y2="35" stroke="rgba(255,255,255,0.1)" stroke-dasharray="2" stroke-width="0.5" />
                <path d="${generateChartPath(logs, health.weightGoal)}" fill="none" stroke="var(--accent-primary)" stroke-width="2" vector-effect="non-scaling-stroke" />
            </svg>
        </div>
    `;
}

function generateChartPath(logs, goal) {
    if (logs.length < 2) return '';
    const weights = logs.map(l => l.weight);
    const minWeight = Math.min(...weights, goal) - 1;
    const maxWeight = Math.max(...weights, goal) + 1;
    const range = maxWeight - minWeight;
    const startTime = logs[0].date;
    const endTime = logs[logs.length - 1].date;
    const timeRange = endTime - startTime || 1;

    const points = logs.map((log, index) => {
        const x = index === 0 ? 0 : ((log.date - startTime) / timeRange) * 100;
        const y = 40 - (((log.weight - minWeight) / range) * 40);
        return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
}

function calculateRemainingWeight(health) {
    if (health.weightLogs.length === 0) return '--';
    const current = health.weightLogs[health.weightLogs.length - 1].weight;
    const diff = current - health.weightGoal;
    return diff > 0 ? diff.toFixed(1) : '¡Logrado!';
}

function calculateTodayCalories(health) {
    const today = new Date().setHours(0, 0, 0, 0);
    return health.calorieLogs
        .filter(log => new Date(log.date).setHours(0, 0, 0, 0) === today)
        .reduce((sum, log) => sum + log.calories, 0);
}

export function setupHealthPageListeners() {
    // Weight tool
    document.getElementById('log-weight-btn')?.addEventListener('click', async () => {
        const weight = await ns.prompt('Registrar Peso', 'Ingresa tu peso actual en kg:', 'Ej: 75.5', 'number');
        if (weight && !isNaN(weight)) {
            store.addWeightLog(weight);
            ns.toast('Peso registrado');
        }
    });

    // Fat tool
    document.getElementById('log-fat-btn')?.addEventListener('click', async () => {
        const fatValue = await ns.prompt('Grasa Corporal', 'Ingresa tu % de grasa (deja en blanco si no lo sabes):', 'Ej: 18.2', 'number');
        if (fatValue !== null) {
            const fat = parseFloat(fatValue);
            if (!isNaN(fat)) {
                store.addFatLog(fat);
                ns.toast('Grasa registrada');
            }
        }
    });

    // Rename Routine
    document.querySelectorAll('.rename-routine').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.dataset.id;
            const currentName = el.dataset.current;
            const newName = await ns.prompt('Renombrar Rutina', 'Nuevo nombre:', currentName);
            if (newName && newName !== currentName) {
                store.renameRoutine(id, newName);
                ns.toast('Rutina renombrada');
            }
        });
    });

    // Add Exercise to Routine
    document.querySelectorAll('.add-exercise-btn').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.dataset.id;
            const name = await ns.prompt('Agregar Ejercicio', 'Nombre del ejercicio:', 'Ej: Press Militar');
            if (name) {
                store.addExerciseToRoutine(id, { name });
                ns.toast('Ejercicio añadido');
            }
        });
    });

    // Delete Routine
    document.querySelectorAll('.delete-routine').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.dataset.id;
            const confirmed = await ns.confirm('Borrar Rutina', '¿Estás seguro de eliminar esta rutina?', 'BORRAR', 'CANCELAR');
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

    // Exercise Logging (STARS)
    const exercises = document.querySelectorAll('.trigger-exercise-log');
    exercises.forEach(el => {
        el.addEventListener('click', async (e) => {
            e.stopPropagation();
            const routineId = el.dataset.routine;
            const index = parseInt(el.dataset.index);
            const name = el.dataset.name;

            const rating = await ns.stars(
                'Monitor de Gym',
                `¿Cómo fue tu desempeño en "${name}"?`
            );

            if (rating) {
                store.logExercise(routineId, index, rating);
                ns.toast('¡Entrenamiento guardado!', 'success');
            }
        });
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
