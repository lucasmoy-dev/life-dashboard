/**
 * Health Page - Fitness and Wellbeing
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

export function renderHealthPage() {
    const state = store.getState();
    const { health } = state;

    return `
    <div class="health-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <h1 class="page-title">Salud</h1>
        <p class="page-subtitle">Trackeo de bienestar y fitness</p>
      </header>

      <!-- METRICS: WEIGHT & FAT -->
      <div class="summary-grid">
        <div class="summary-item card clickable" id="log-weight-btn">
          <div class="summary-value">${health.weightLogs.length > 0 ? health.weightLogs[health.weightLogs.length - 1].weight : '--'} kg</div>
          <div class="summary-label">Peso Actual</div>
        </div>
        <div class="summary-item card clickable" id="log-fat-btn">
          <div class="summary-value">${health.fatLogs.length > 0 ? health.fatLogs[health.fatLogs.length - 1].fat : '--'} %</div>
          <div class="summary-label">Grasa Corporal</div>
        </div>
      </div>

      <!-- GOAL PROGRESS (BURNDOWN CHART SIMULATION) -->
      <div class="card health-goal-card">
        <div class="card-header">
          <span class="card-title">Progreso hacia el Objetivo</span>
          ${getIcon('target', 'card-icon')}
        </div>
        <div class="burndown-container">
            ${renderBurndownChart(health)}
        </div>
        <div class="goal-stats">
            <div class="goal-stat">
                <span class="goal-label">Objetivo:</span>
                <span class="goal-value">${health.weightGoal} kg</span>
            </div>
            <div class="goal-stat">
                <span class="goal-label">Pendiente:</span>
                <span class="goal-value">${calculateRemainingWeight(health)} kg</span>
            </div>
        </div>
      </div>

      <!-- AI CALORIE TRACKER -->
      <div class="card ai-calorie-card">
        <div class="card-header">
          <span class="card-title">Contador de Calorías IA</span>
          ${getIcon('zap', 'card-icon', 'style="color: var(--accent-tertiary)"')}
        </div>
        <p class="card-desc">Sube una foto de tu comida y la IA detectará las calorías automáticamente.</p>
        <button class="btn btn-primary ai-scan-btn" id="ai-scan-photo">
            ${getIcon('camera')}
            Anotar con Foto (IA)
        </button>
        <div class="calorie-brief">
            Hoy: <strong>${calculateTodayCalories(health)}</strong> kcal
        </div>
      </div>

      <!-- WORKOUT ROUTINES -->
      <div class="section-divider">
        <span class="section-title">Rutinas de Entrenamiento</span>
      </div>

      <div class="routines-list">
        ${health.routines.map(routine => `
          <div class="card routine-card">
            <div class="routine-header">
                <div class="routine-info">
                    <div class="routine-name">${routine.name}</div>
                    <div class="routine-meta">${routine.exercises.length} ejercicios</div>
                </div>
                <button class="icon-btn edit-routine" data-id="${routine.id}">
                    ${getIcon('edit')}
                </button>
            </div>
            <div class="exercise-list">
                ${routine.exercises.slice(0, 3).map(ex => `
                    <div class="exercise-item">
                        <span class="ex-name">${ex.name}</span>
                        <span class="ex-weight">${ex.weight} kg</span>
                    </div>
                `).join('')}
                ${routine.exercises.length > 3 ? `<div class="more-exercises">+ ${routine.exercises.length - 3} más</div>` : ''}
            </div>
          </div>
        `).join('')}
        
        <button class="btn btn-secondary add-routine-btn" id="add-routine-btn">
            ${getIcon('plus')} Agregar Nueva Rutina
        </button>
      </div>
    </div>
  `;
}

function renderBurndownChart(health) {
    // We'll simulate a SVG burndown chart
    const logs = health.weightLogs;
    if (logs.length < 2) {
        return `<div class="empty-chart-msg">Registra al menos 2 pesos para ver el gráfico.</div>`;
    }

    // Simple line chart shell
    return `
        <div class="simple-chart-placeholder">
            <svg viewBox="0 0 100 40" class="burndown-line" preserveAspectRatio="none">
                <!-- Goal Line -->
                <line x1="0" y1="35" x2="100" y2="35" stroke="rgba(255,255,255,0.1)" stroke-dasharray="2" stroke-width="0.5" />
                
                <!-- Progress Line -->
                <path d="${generateChartPath(logs, health.weightGoal)}" fill="none" stroke="var(--accent-primary)" stroke-width="2" vector-effect="non-scaling-stroke" />
            </svg>
        </div>
    `;
}

function generateChartPath(logs, goal) {
    if (logs.length < 2) return '';

    // Normalize data to fit 100x40 SVG coordinate system
    // X axis: time (0 to 100)
    // Y axis: weight (0 to 40, inverted because SVG Y is down)

    // Find min and max for scaling
    const weights = logs.map(l => l.weight);
    const minWeight = Math.min(...weights, goal) - 1; // buffer
    const maxWeight = Math.max(...weights, goal) + 1; // buffer
    const range = maxWeight - minWeight;

    const startTime = logs[0].date;
    const endTime = logs[logs.length - 1].date;
    const timeRange = endTime - startTime || 1; // avoid divide by zero

    const points = logs.map((log, index) => {
        // X position: percentage of time passed
        const x = index === 0 ? 0 : ((log.date - startTime) / timeRange) * 100;

        // Y position: percentage of weight range, inverted (higher weight = lower Y value? No, SVG 0 is top)
        // High weight should be low Y value (top of graph = max weight? No usually bottom is 0)
        // Let's say top (0) is maxWeight, bottom (40) is minWeight
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
        const fat = await ns.prompt('Grasa Corporal', 'Ingresa tu % de grasa:', 'Ej: 18.2', 'number');
        if (fat && !isNaN(fat)) {
            store.addFatLog(fat);
            ns.toast('Grasa registrada');
        }
    });

    // AI Scan simulation
    document.getElementById('ai-scan-photo')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                ns.toast('Analizando imagen con IA...', 'info');
                setTimeout(async () => {
                    const mockCals = Math.floor(Math.random() * 500) + 200;
                    const confirmed = await ns.confirm('IA Detectada', `La visión artificial detectó una "Ensalada César" con aproximadamente ${mockCals} kcal. ¿Registrar?`);
                    if (confirmed) {
                        store.addCalorieLog(mockCals, 'Ensalada César (IA)');
                        ns.toast('Calorías registradas');
                    }
                }, 1500);
            }
        };
        input.click();
    });

    // Add routine
    document.getElementById('add-routine-btn')?.addEventListener('click', async () => {
        const name = await ns.prompt('Nueva Rutina', 'Nombre de la rutina (ej: Pierna):', 'Nombre');
        if (name) {
            store.saveRoutine({ name, exercises: [] });
            ns.toast('Rutina creada');
        }
    });
}
