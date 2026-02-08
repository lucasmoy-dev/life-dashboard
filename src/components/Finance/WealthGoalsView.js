/**
 * Wealth Goals View - Financial objectives and projections
 */
import { store } from '../../store.js';
import { formatCurrency } from '../../utils/format.js';
import { getIcon } from '../../utils/icons.js';
import { ns } from '../../utils/notifications.js';

export function renderWealthGoalsView() {
    const state = store.getState();
    const { wealthGoals = [], inflationRate = 3.0, projectionYears = 10, currencySymbol } = state;
    const currentExpenses = store.getAllExpenses();

    // Calculate totals
    let totalPassiveIncomeMonthly = 0;
    wealthGoals.forEach(g => {
        const monthlyYield = (g.cost * (g.dividendYield / 100)) / 12;
        totalPassiveIncomeMonthly += store.convertValue(monthlyYield, g.currency || state.currency);
    });

    const netPassiveIncome = totalPassiveIncomeMonthly - currentExpenses;

    // Future Projections
    const futureExpenses = currentExpenses * Math.pow(1 + (inflationRate / 100), projectionYears);

    let totalFuturePassiveMonthly = 0;
    wealthGoals.forEach(g => {
        const futureValue = g.cost * Math.pow(1 + (g.annualGrowth / 100), projectionYears);
        const futureMonthlyYield = (futureValue * (g.dividendYield / 100)) / 12;
        totalFuturePassiveMonthly += store.convertValue(futureMonthlyYield, g.currency || state.currency);
    });

    const futureNetPassive = totalFuturePassiveMonthly - futureExpenses;

    return `
    <div class="wealth-goals-view animate-fade-in">
        <!-- Projections Summary Card -->
        <div class="card projection-summary-card">
            <div class="card-header">
                <span class="card-title">Proyección de Libertad Financiera</span>
                ${getIcon('trendingUp', 'card-icon')}
            </div>
            
            <div class="projection-grid">
                <div class="projection-col">
                    <div class="projection-label">Estado Actual</div>
                    <div class="stat-row">
                        <span>Ingresos Pasivos</span>
                        <span class="stat-value positive">${formatCurrency(totalPassiveIncomeMonthly, currencySymbol)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Gastos Totales</span>
                        <span class="stat-value negative">${formatCurrency(currentExpenses, currencySymbol)}</span>
                    </div>
                    <div class="stat-row divider">
                        <span>Neto</span>
                        <span class="stat-value ${netPassiveIncome >= 0 ? 'positive' : 'negative'}">${formatCurrency(netPassiveIncome, currencySymbol)}</span>
                    </div>
                </div>

                <div class="projection-divider-vertical"></div>

                <div class="projection-col">
                    <div class="projection-label">En <span id="years-val-title">${projectionYears}</span> años (<span id="inflation-val-title">${inflationRate}</span>% inf.)</div>
                    <div class="stat-row">
                        <span>Ingresos Pasivos Est.</span>
                        <span class="stat-value positive" id="future-passive-val">${formatCurrency(totalFuturePassiveMonthly, currencySymbol)}</span>
                    </div>
                    <div class="stat-row">
                        <span>Gastos Est.</span>
                        <span class="stat-value negative" id="future-expenses-val">${formatCurrency(futureExpenses, currencySymbol)}</span>
                    </div>
                    <div class="stat-row divider">
                        <span>Neto Proyectado</span>
                        <span class="stat-value ${futureNetPassive >= 0 ? 'positive' : 'negative'}" id="future-net-val">${formatCurrency(futureNetPassive, currencySymbol)}</span>
                    </div>
                </div>
            </div>
            
            <div class="projection-settings-row">
                <div class="setting-item">
                    <label>Años proyectados: <span id="years-val">${projectionYears}</span></label>
                    <input type="range" id="years-slider" min="1" max="50" step="1" value="${projectionYears}">
                </div>
                <div class="setting-item">
                    <label>Inflación anual: <span id="inflation-val">${inflationRate}</span>%</label>
                    <input type="range" id="inflation-slider" min="0" max="20" step="0.5" value="${inflationRate}">
                </div>
            </div>
        </div>

        <div class="section-divider">
            <span class="section-title">Objetivos Patrimoniales</span>
            <button class="btn-add-goal-inline btn-large-inline" id="btn-add-wealth-goal">
                ${getIcon('plus')} Agregar
            </button>
        </div>

        <div class="wealth-goals-list">
            ${wealthGoals.length === 0 ? `
                <div class="empty-state">
                    ${getIcon('target', 'empty-icon')}
                    <p>No tienes objetivos guardados aún.</p>
                </div>
            ` : wealthGoals.map(goal => renderGoalCard(goal, state)).join('')}
        </div>
    </div>
    `;
}

function renderGoalCard(goal, state) {
    const currencySymbol = state.currencySymbol;
    const monthlyIncome = (goal.cost * (goal.dividendYield / 100)) / 12;
    const convertedMonthly = store.convertValue(monthlyIncome, goal.currency || state.currency);

    return `
    <div class="card wealth-goal-card" data-id="${goal.id}">
        <div class="goal-card-main">
            <div class="goal-card-info">
                <div class="goal-name">${goal.name}</div>
                <div class="goal-cost">${formatCurrency(goal.cost, goal.currency || state.currency)} cost</div>
            </div>
            <div class="goal-card-yield">
                <div class="yield-value stat-value positive">+${formatCurrency(convertedMonthly, currencySymbol)}/mes</div>
                <div class="yield-pct">${goal.dividendYield}% div.</div>
            </div>
        </div>
        <div class="goal-card-details">
            <div class="detail-item">
                <span class="detail-label">Crecimiento Anual:</span>
                <span class="detail-value">${goal.annualGrowth}%</span>
            </div>
            <div class="goal-actions">
                <div class="goal-reorder-actions">
                    <button class="icon-btn reorder-wealth-goal" data-id="${goal.id}" data-dir="up">${getIcon('chevronUp')}</button>
                    <button class="icon-btn reorder-wealth-goal" data-id="${goal.id}" data-dir="down">${getIcon('chevronDown')}</button>
                </div>
                <div style="flex: 1;"></div>
                <button class="icon-btn edit-wealth-goal" data-id="${goal.id}">${getIcon('edit')}</button>
                <button class="icon-btn delete-wealth-goal" data-id="${goal.id}">${getIcon('trash')}</button>
            </div>
        </div>
    </div>
    `;
}

export function setupWealthGoalsListeners() {
    // Add goal
    document.getElementById('btn-add-wealth-goal')?.addEventListener('click', async () => {
        openWealthGoalModal();
    });

    // Edit goal
    document.querySelectorAll('.edit-wealth-goal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const goal = store.getState().wealthGoals.find(g => g.id === id);
            if (goal) openWealthGoalModal(goal);
        });
    });

    // Delete goal
    document.querySelectorAll('.delete-wealth-goal').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const confirmed = await ns.confirm('Eliminar objetivo', '¿Estás seguro de que deseas eliminar este objetivo?');
            if (confirmed) {
                store.deleteWealthGoal(id);
                window.reRender?.();
            }
        });
    });

    // Reorder goal
    document.querySelectorAll('.reorder-wealth-goal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const dir = btn.dataset.dir;
            store.reorderWealthGoals(id, dir);
            window.reRender?.();
        });
    });

    const inflationSlider = document.getElementById('inflation-slider');
    const yearsSlider = document.getElementById('years-slider');

    // Projections real-time update logic
    const updateProjections = () => {
        const years = parseFloat(yearsSlider.value);
        const inflation = parseFloat(inflationSlider.value);

        // Update labels
        const yearsValEl = document.getElementById('years-val');
        const inflationValEl = document.getElementById('inflation-val');
        const yearsValTitleEl = document.getElementById('years-val-title');
        const inflationValTitleEl = document.getElementById('inflation-val-title');

        if (yearsValEl) yearsValEl.textContent = years;
        if (yearsValTitleEl) yearsValTitleEl.textContent = years;
        if (inflationValEl) inflationValEl.textContent = inflation;
        if (inflationValTitleEl) inflationValTitleEl.textContent = inflation;

        // Re-calculate projections
        const state = store.getState();
        const currentExpenses = store.getAllExpenses();
        const futureExpenses = currentExpenses * Math.pow(1 + (inflation / 100), years);

        let totalFuturePassiveMonthly = 0;
        state.wealthGoals.forEach(g => {
            const futureValue = g.cost * Math.pow(1 + (g.annualGrowth / 100), years);
            const futureMonthlyYield = (futureValue * (g.dividendYield / 100)) / 12;
            totalFuturePassiveMonthly += store.convertValue(futureMonthlyYield, g.currency || state.currency);
        });

        const futureNetPassive = totalFuturePassiveMonthly - futureExpenses;
        const currencySymbol = state.currencySymbol;

        // Update UI elements
        const futurePassiveEl = document.getElementById('future-passive-val');
        const futureExpensesEl = document.getElementById('future-expenses-val');
        const futureNetEl = document.getElementById('future-net-val');

        if (futurePassiveEl) futurePassiveEl.textContent = formatCurrency(totalFuturePassiveMonthly, currencySymbol);
        if (futureExpensesEl) futureExpensesEl.textContent = formatCurrency(futureExpenses, currencySymbol);
        if (futureNetEl) {
            futureNetEl.textContent = formatCurrency(futureNetPassive, currencySymbol);
            futureNetEl.className = `stat-value ${futureNetPassive >= 0 ? 'positive' : 'negative'}`;
        }
    };

    if (inflationSlider) {
        inflationSlider.addEventListener('input', updateProjections);
        inflationSlider.addEventListener('change', (e) => {
            store.setInflationRate(e.target.value);
            // No re-render needed, already updated by input, but saving to store is necessary
        });
    }

    if (yearsSlider) {
        yearsSlider.addEventListener('input', updateProjections);
        yearsSlider.addEventListener('change', (e) => {
            store.setProjectionYears(e.target.value);
        });
    }
}

async function openWealthGoalModal(goal = null) {
    const isEdit = !!goal;
    const title = isEdit ? 'Editar Objetivo' : 'Nuevo Objetivo Patrimonial';

    // Simple prompt-based modal or custom one. Let's build a custom one for better UX.
    const container = document.createElement('div');
    container.className = 'modal-overlay active overlay-centered';
    container.innerHTML = `
        <div class="modal animate-pop-in" style="width: 100%; max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="close-modal-btn">${getIcon('x')}</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Nombre del Objetivo</label>
                    <input type="text" id="goal-name" class="form-input" placeholder="Ej: Inmueble en Carlos Paz" value="${goal?.name || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Coste / Valor actual</label>
                    <div class="input-with-currency">
                        <input type="number" id="goal-cost" class="form-input" placeholder="100000" value="${goal?.cost || ''}">
                        <select id="goal-currency" class="currency-mini-select">
                            ${['EUR', 'USD', 'ARS', 'GBP', 'CHF'].map(c => `<option value="${c}" ${goal?.currency === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Crecimiento % (Anual)</label>
                        <input type="number" id="goal-growth" class="form-input" placeholder="5" value="${goal?.annualGrowth || ''}" step="0.1">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Dividendos % (Anual)</label>
                        <input type="number" id="goal-dividend" class="form-input" placeholder="4" value="${goal?.dividendYield || ''}" step="0.1">
                    </div>
                </div>
                <button class="btn btn-primary" id="save-goal-btn" style="width: 100%; margin-top: var(--spacing-md);">
                    ${isEdit ? 'Guardar Cambios' : 'Crear Objetivo'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    const closeBtn = container.querySelector('.close-modal-btn');
    const saveBtn = container.querySelector('#save-goal-btn');

    const closeModal = () => {
        container.classList.remove('active');
        setTimeout(() => container.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    container.addEventListener('click', (e) => {
        if (e.target === container) closeModal();
    });

    saveBtn.addEventListener('click', () => {
        const name = container.querySelector('#goal-name').value;
        const cost = parseFloat(container.querySelector('#goal-cost').value);
        const annualGrowth = parseFloat(container.querySelector('#goal-growth').value) || 0;
        const dividendYield = parseFloat(container.querySelector('#goal-dividend').value) || 0;
        const currency = container.querySelector('#goal-currency').value;

        if (!name || isNaN(cost)) {
            ns.toast('Completa nombre y coste', 'error');
            return;
        }

        const goalData = {
            name,
            cost,
            annualGrowth,
            dividendYield,
            currency
        };

        if (isEdit) {
            store.updateWealthGoal(goal.id, goalData);
            ns.toast('Objetivo actualizado');
        } else {
            store.addWealthGoal(goalData);
            ns.toast('Objetivo creado');
        }

        closeModal();
        window.reRender?.();
    });
}
