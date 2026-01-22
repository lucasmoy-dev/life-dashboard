/**
 * Edit Item Modal - For editing/deleting existing assets, incomes, expenses, or liabilities
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { formatCurrency } from '../utils/format.js';
import { ns } from '../utils/notifications.js';

const CATEGORY_CONFIG = {
  passive: {
    label: 'Activo Pasivo',
    storeKey: 'passiveAssets',
    updateMethod: 'updatePassiveAsset',
    deleteMethod: 'deletePassiveAsset',
    fields: ['value', 'monthlyIncome']
  },
  investment: {
    label: 'Activo de Inversión',
    storeKey: 'investmentAssets',
    updateMethod: 'updateInvestmentAsset',
    deleteMethod: 'deleteInvestmentAsset',
    fields: ['value']
  },
  liability: {
    label: 'Pasivo/Deuda',
    storeKey: 'liabilities',
    updateMethod: 'updateLiability',
    deleteMethod: 'deleteLiability',
    fields: ['amount', 'monthlyPayment']
  },
  activeIncome: {
    label: 'Ingreso Activo',
    storeKey: 'activeIncomes',
    updateMethod: 'updateActiveIncome',
    deleteMethod: 'deleteActiveIncome',
    fields: ['amount']
  },
  livingExpense: {
    label: 'Gasto de Vida',
    storeKey: 'livingExpenses',
    updateMethod: 'updateLivingExpense',
    deleteMethod: 'deleteLivingExpense',
    fields: ['amount']
  }
};

let currentItem = null;
let currentCategory = null;

export function openEditModal(id, category) {
  const config = CATEGORY_CONFIG[category];
  if (!config) {
    console.error('Unknown category:', category);
    return;
  }

  const state = store.getState();
  const items = state[config.storeKey];
  const item = items.find(i => i.id === id);

  if (!item) {
    console.error('Item not found:', id);
    return;
  }

  currentItem = item;
  currentCategory = category;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'edit-modal';
  overlay.innerHTML = renderEditModal(item, config);

  document.body.appendChild(overlay);

  // Trigger animation
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  setupEditModalListeners(config);
}

const CURRENCIES = [
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'Dólar ($)' },
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'XRP', label: 'Ripple (XRP)' },
  { value: 'GOLD', label: 'Oro (XAU)' },
  { value: 'SP500', label: 'S&P 500 (SPX)' }
];

function renderEditModal(item, config) {
  const symbol = store.getState().currencySymbol;

  let valueFields = '';

  if (config.fields.includes('value')) {
    const label = currentCategory === 'investment' ? 'Cantidad / Valor' : 'Valor Total';
    valueFields += `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <input type="number" class="form-input" id="edit-value" value="${item.value || 0}" step="any" inputmode="decimal">
      </div>
    `;
  }

  if (config.fields.includes('amount')) {
    const label = currentCategory === 'liability' ? 'Monto Total' :
      currentCategory === 'livingExpense' ? 'Gasto Mensual' : 'Ingreso Mensual';
    valueFields += `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <input type="number" class="form-input" id="edit-amount" value="${item.amount || 0}" inputmode="numeric">
      </div>
    `;
  }

  if (config.fields.includes('monthlyIncome')) {
    valueFields += `
      <div class="form-group">
        <label class="form-label">Ingreso Mensual</label>
        <input type="number" class="form-input" id="edit-monthly" value="${item.monthlyIncome || 0}" inputmode="numeric">
      </div>
    `;
  }

  if (config.fields.includes('monthlyPayment')) {
    valueFields += `
      <div class="form-group">
        <label class="form-label">Pago Mensual</label>
        <input type="number" class="form-input" id="edit-monthly" value="${item.monthlyPayment || 0}" inputmode="numeric">
      </div>
    `;
  }

  return `
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">Editar ${config.label}</h2>
        <button class="modal-close" id="edit-modal-close">
          ${getIcon('x')}
        </button>
      </div>
      
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input type="text" class="form-input" id="edit-name" value="${item.name || ''}">
      </div>

      <div class="form-group">
        <label class="form-label">Moneda/Activo</label>
        <select class="form-input form-select" id="edit-currency">
          ${CURRENCIES.map(c => `<option value="${c.value}" ${c.value === item.currency ? 'selected' : ''}>${c.label}</option>`).join('')}
        </select>
      </div>
      
      ${valueFields}
      
      <div class="form-group">
        <label class="form-label">Detalles (opcional)</label>
        <input type="text" class="form-input" id="edit-details" value="${item.details || ''}" placeholder="Notas adicionales...">
      </div>
      
      <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
        <button class="btn btn-danger" id="btn-delete" style="flex: 0 0 auto; width: auto; padding: 14px 20px;">
          ${getIcon('trash')}
        </button>
        <button class="btn btn-primary" id="btn-update" style="flex: 1;">
          Guardar Cambios
        </button>
      </div>
    </div>
  `;
}

function setupEditModalListeners(config) {
  const overlay = document.getElementById('edit-modal');
  const closeBtn = document.getElementById('edit-modal-close');
  const updateBtn = document.getElementById('btn-update');
  const deleteBtn = document.getElementById('btn-delete');

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeEditModal();
  });

  // Close button
  closeBtn.addEventListener('click', closeEditModal);

  // Update button
  updateBtn.addEventListener('click', () => handleUpdate(config));

  // Delete button
  deleteBtn.addEventListener('click', () => handleDelete(config));
}

function handleUpdate(config) {
  const name = document.getElementById('edit-name')?.value?.trim();
  const currency = document.getElementById('edit-currency')?.value;
  const details = document.getElementById('edit-details')?.value?.trim();
  const value = parseFloat(document.getElementById('edit-value')?.value) || 0;
  const amount = parseFloat(document.getElementById('edit-amount')?.value) || 0;
  const monthly = parseFloat(document.getElementById('edit-monthly')?.value) || 0;

  if (!name) {
    ns.alert('Requerido', 'El nombre es obligatorio para guardar los cambios.');
    return;
  }

  const updates = { name, currency, details };

  if (config.fields.includes('value')) {
    updates.value = value;
  }
  if (config.fields.includes('amount')) {
    updates.amount = amount;
  }
  if (config.fields.includes('monthlyIncome')) {
    updates.monthlyIncome = monthly;
  }
  if (config.fields.includes('monthlyPayment')) {
    updates.monthlyPayment = monthly;
  }

  // Call the appropriate store method
  store[config.updateMethod](currentItem.id, updates);

  closeEditModal();
}

function handleDelete(config) {
  ns.confirm('¿Eliminar?', `¿Estás seguro de que quieres borrar "${currentItem.name}"? Esta acción no se puede deshacer.`).then(confirmed => {
    if (confirmed) {
      store[config.deleteMethod](currentItem.id);
      ns.toast('Eliminado correctamente', 'info');
      closeEditModal();
    }
  });
}

function closeEditModal() {
  const overlay = document.getElementById('edit-modal');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  }
  currentItem = null;
  currentCategory = null;
}
