/**
 * Time Invest Page - Activity tracking and time management
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

let currentTab = 'tracker'; // 'tracker' | 'stats'
let activeTimer = null; // { activityId, startTime, elapsedSeconds, interval }
let showPomodoro = false;

export function renderTimeInvestPage() {
    const state = store.getState();
    const { activities = [], logs = [] } = state.timeInvest || {};

    return `
    <div class="time-invest-page stagger-children">
        <header class="page-header">
            <h1 class="page-title">Time Invest</h1>
            <p class="page-subtitle">Invierte tu tiempo con propósito</p>
        </header>

        <div class="segmented-control">
            <button class="segment-btn ${currentTab === 'tracker' ? 'active' : ''}" id="tab-tracker">
                Tracker
            </button>
            <button class="segment-btn ${currentTab === 'stats' ? 'active' : ''}" id="tab-stats">
                Stats
            </button>
        </div>

        ${currentTab === 'tracker' ? renderTrackerView(activities) : renderStatsView(activities, logs)}

        ${activeTimer ? renderActiveTimerOverlay(activities) : ''}
    </div>
    `;
}

function renderTrackerView(activities) {
    return `
    <div class="tracker-view animate-fade-in">
        <div class="section-divider">
            <span class="section-title">Actividades</span>
            <button class="btn-add-goal-inline" id="btn-add-activity">
                ${getIcon('plus')} Configurar
            </button>
        </div>

        <div class="activities-grid">
            ${activities.map(activity => `
                <div class="activity-btn" data-id="${activity.id}" style="--color: ${activity.color}; --color-alpha: ${activity.color}20">
                    <div class="activity-icon-container">
                        ${getIcon(activity.icon || 'brain')}
                    </div>
                    <span class="activity-label">${activity.name}</span>
                </div>
            `).join('')}
        </div>

        <div class="card" style="margin-top: var(--spacing-xl);">
            <div class="toggle-row">
                <div class="setting-info">
                    <div class="setting-label">Modo Pomodoro</div>
                    <div class="setting-desc">Avisar cuando termine el tiempo</div>
                </div>
                <input type="checkbox" id="pomodoro-toggle" class="apple-switch" ${showPomodoro ? 'checked' : ''}>
            </div>
        </div>
    </div>
    `;
}

function renderStatsView(activities, logs) {
    // Calculate stats (last 7 days by default)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats = activities.map(activity => {
        const activityLogs = logs.filter(l => l.activityId === activity.id && new Date(l.date) >= sevenDaysAgo);
        const totalMinutes = activityLogs.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
        const dailyAverage = totalMinutes / 7;
        return { name: activity.name, totalMinutes, dailyAverage, color: activity.color };
    });

    const maxVal = Math.max(...stats.map(s => s.totalMinutes), 60);

    return `
    <div class="stats-view animate-fade-in">
        <div class="card stats-card">
            <div class="card-header">
                <span class="card-title">Inversión Semanal (minutos)</span>
                ${getIcon('barChart2')}
            </div>
            
            <div class="chart-placeholder">
                ${stats.map(s => `
                    <div class="chart-bar" style="height: ${(s.totalMinutes / maxVal) * 100}%; background: ${s.color};">
                        <div class="chart-bar-value">${Math.round(s.totalMinutes)}m</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="chart-legend" style="margin-top: var(--spacing-md); display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                ${stats.map(s => `
                    <div class="legend-item" style="display: flex; align-items: center; gap: 4px; font-size: 11px;">
                        <div style="width: 8px; height: 8px; border-radius: 2px; background: ${s.color};"></div>
                        <span>${s.name}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section-divider">
            <span class="section-title">Promedios de Inversión</span>
        </div>

        <div class="asset-list">
            ${stats.map(s => `
                <div class="asset-item">
                    <div class="asset-info">
                        <div class="asset-name">${s.name}</div>
                        <div class="asset-details">Promedio diario esta semana</div>
                    </div>
                    <div class="asset-value">
                        ${Math.round(s.dailyAverage)}m <span style="font-size: 10px; opacity: 0.6;">/día</span>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    `;
}

function renderActiveTimerOverlay(activities) {
    const activity = activities.find(a => a.id === activeTimer.activityId);
    const timeStr = formatTime(activeTimer.elapsedSeconds);

    return `
    <div class="timer-overlay animate-fade-in">
        <div class="timer-active-label">Invirtiendo en...</div>
        <div class="activity-label" style="font-size: 32px; margin-bottom: var(--spacing-xl); color: ${activity?.color}">${activity?.name}</div>
        
        <div class="timer-display">${timeStr}</div>

        <div class="timer-controls">
            <!-- No pause for now to keep it simple, just stop/complete -->
            <button class="timer-btn stop" id="btn-stop-timer">
                ${getIcon('x')}
            </button>
            <button class="timer-btn" id="btn-complete-timer" style="background: var(--accent-success); color: white;">
                ${getIcon('check')}
            </button>
        </div>
        
        ${showPomodoro ? `<p style="margin-top: 40px; color: var(--text-muted); font-size: 14px;">Pomodoro activo (${store.getState().timeInvest.pomodoroTime} min)</p>` : ''}
    </div>
    `;
}

function formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function setupTimeInvestListeners() {
    // Tab Listeners
    document.getElementById('tab-tracker')?.addEventListener('click', () => {
        currentTab = 'tracker';
        window.reRender?.();
    });
    document.getElementById('tab-stats')?.addEventListener('click', () => {
        currentTab = 'stats';
        window.reRender?.();
    });

    // Activity buttons
    document.querySelectorAll('.activity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            startTracking(id);
        });
    });

    // Pomodoro toggle
    document.getElementById('pomodoro-toggle')?.addEventListener('change', (e) => {
        showPomodoro = e.target.checked;
    });

    // Timer controls
    document.getElementById('btn-stop-timer')?.addEventListener('click', () => {
        if (confirm('¿Deseas cancelar esta sesión? No se guardarán los datos.')) {
            stopTracking(false);
        }
    });

    document.getElementById('btn-complete-timer')?.addEventListener('click', () => {
        stopTracking(true);
    });

    // Manage activities
    document.getElementById('btn-add-activity')?.addEventListener('click', () => {
        ns.toast('Función de personalización próximamente...', 'info');
    });
}

function startTracking(activityId) {
    if (activeTimer) return;

    activeTimer = {
        activityId,
        startTime: Date.now(),
        elapsedSeconds: 0,
        interval: setInterval(() => {
            activeTimer.elapsedSeconds = Math.floor((Date.now() - activeTimer.startTime) / 1000);

            // UI Update without full rerender if possible? 
            // For now, let's just update the specific element if visible
            const display = document.querySelector('.timer-display');
            if (display) {
                display.textContent = formatTime(activeTimer.elapsedSeconds);
            }

            // Pomodoro check
            if (showPomodoro) {
                const pomodoroMinutes = store.getState().timeInvest.pomodoroTime || 25;
                if (activeTimer.elapsedSeconds === pomodoroMinutes * 60) {
                    playAlarm();
                    ns.toast('¡Tiempo Pomodoro cumplido!', 'success');
                }
            }
        }, 1000)
    };

    window.reRender?.();
}

function stopTracking(save = false) {
    if (!activeTimer) return;

    clearInterval(activeTimer.interval);

    if (save) {
        const durationMinutes = Math.floor(activeTimer.elapsedSeconds / 60);
        if (durationMinutes >= 1) {
            store.addTimeLog({
                activityId: activeTimer.activityId,
                date: new Date().toISOString(),
                durationMinutes
            });
            ns.toast(`¡Excelente! Has invertido ${durationMinutes} min.`, 'success');
        } else {
            ns.toast('Sesión muy corta para ser registrada.', 'info');
        }
    }

    activeTimer = null;
    window.reRender?.();
}

function playAlarm() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (e) {
        console.error('Audio error:', e);
    }
}
