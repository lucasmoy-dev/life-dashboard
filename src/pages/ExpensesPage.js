/**
 * Expenses Page - Detailed breakdown of monthly expenses
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { formatCurrency } from '../utils/format.js';
import { openEditModal } from '../components/EditModal.js';

export function renderExpensesPage() {
    const state = store.getState();
    const symbol = state.currencySymbol;

    const livingExpenses = state.livingExpenses;
    const otherExpenses = state.otherExpenses || [];
    const liabilities = state.liabilities;

    // Calculate totals
    const totalLiving = store.getLivingExpenses();
    const totalOther = store.sumItems(otherExpenses, 'amount');
    const totalDebt = store.sumItems(liabilities, 'monthlyPayment');

    const totalAll = totalLiving + totalOther + totalDebt;

    // Combine all expense items for the list
    const allItems = [
        ...livingExpenses.map(item => ({ ...item, category: 'livingExpense', typeLabel: 'Gasto de Vida' })),
        ...otherExpenses.map(item => ({ ...item, category: 'otherExpense', typeLabel: 'Otro Gasto' })),
        ...liabilities.filter(l => l.monthlyPayment > 0).map(item => ({
            ...item,
            amount: item.monthlyPayment,
            category: 'liability',
            typeLabel: 'Deuda / Hipoteca'
        }))
    ].sort((a, b) => b.amount - a.amount);

    return `
    <div class="expenses-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div class="header-row" style="display: flex; align-items: center; gap: var(--spacing-sm);">
            <button class="icon-btn-back" id="back-to-finance">
                ${getIcon('chevronLeft')}
            </button>
            <h1 class="page-title" style="margin-bottom: 0;">Gastos Mensuales</h1>
        </div>
        <p class="page-subtitle" style="margin-left: 40px;">Desglose detallado de tus salidas</p>
      </header>
      
      <!-- PRIMARY METRIC -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Total Mensual</span>
          ${getIcon('creditCard', 'card-icon')}
        </div>
        <div class="stat-value negative text-center" style="font-size: 32px; margin: var(--spacing-md) 0;">
            ${formatCurrency(totalAll, symbol)}
        </div>
        
        <div class="expense-breakdown-row">
            <div class="breakdown-item">
                <div class="breakdown-val">${formatCurrency(totalLiving, symbol)}</div>
                <div class="breakdown-lbl">Vida</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${formatCurrency(totalDebt, symbol)}</div>
                <div class="breakdown-lbl">Deuda</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-val">${formatCurrency(totalOther, symbol)}</div>
                <div class="breakdown-lbl">Otros</div>
            </div>
        </div>
      </div>

      <!-- EXPENSES LIST -->
      <div class="section-divider">
        <span class="section-title">Detalle de Gastos</span>
      </div>
      
      ${renderExpensesList(allItems, state)}

    </div>
  `;
}

function renderExpensesList(items, state) {
    if (items.length === 0) {
        return `
            <div class="empty-state">
                ${getIcon('creditCard', 'empty-icon')}
                <div class="empty-title">Sin gastos registrados</div>
                <p class="empty-description">Tus gastos de vida, deudas y otros pagos aparecerán aquí.</p>
            </div>
        `;
    }

    const baseSymbol = state.currencySymbol;

    return `
        <div class="asset-list">
            ${items.map(item => {
        const displayValue = store.convertValue(item.amount, item.currency || 'EUR');
        const icon = getExpenseIcon(item.category);

        return `
                <div class="asset-item expense-item" data-id="${item.id}" data-category="${item.category}">
                    <div class="asset-icon-wrapper expense">
                        ${getIcon(icon, 'asset-icon')}
                    </div>
                    <div class="asset-info">
                        <div class="asset-name">${item.name}</div>
                        <div class="asset-details">${item.typeLabel}</div>
                    </div>
                    <div class="asset-value text-negative">
                        -${formatCurrency(displayValue, baseSymbol)}
                    </div>
                </div>
                `;
    }).join('')}
        </div>
    `;
}

function getExpenseIcon(category) {
    switch (category) {
        case 'liability': return 'landmark';
        case 'livingExpense': return 'shoppingCart';
        default: return 'creditCard';
    }
}

export function setupExpensesPageListeners(onBack) {
    const backBtn = document.getElementById('back-to-finance');
    if (backBtn) {
        backBtn.addEventListener('click', onBack);
    }

    const items = document.querySelectorAll('.expense-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            const category = item.dataset.category;
            // We reuse the EditModal. For liabilities it works, for livingExpense strictu sensu too.
            // If adding new expense types, EditModal might need adjustments.
            openEditModal(id, category);
        });
    });
}
