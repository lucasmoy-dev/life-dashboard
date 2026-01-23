import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { formatCurrency } from '../utils/format.js';
import { ns } from '../utils/notifications.js';
import { MARKET_ASSETS } from '../services/MarketService.js';

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

const ITEM_TYPES_MAP = {
  passive: [
    { value: 'rental', label: 'Inmueble en Renta' },
    { value: 'stocks', label: 'Acciones/Dividendos' },
    { value: 'etf', label: 'ETF/Fondos' },
    { value: 'bonds', label: 'Bonos' },
    { value: 'crypto', label: 'Crypto Staking' },
    { value: 'business', label: 'Negocio Pasivo' },
    { value: 'royalties', label: 'Regalías' },
    { value: 'other', label: 'Otro' }
  ],
  investment: [
    { value: 'property', label: 'Inmueble' },
    { value: 'stocks', label: 'Acciones' },
    { value: 'etf', label: 'ETF/Fondos' },
    { value: 'crypto', label: 'Criptomoneda' },
    { value: 'cash', label: 'Efectivo/Ahorro' },
    { value: 'vehicle', label: 'Vehículo' },
    { value: 'collectibles', label: 'Coleccionables' },
    { value: 'other', label: 'Otro' }
  ],
  liability: [
    { value: 'mortgage', label: 'Hipoteca' },
    { value: 'loan', label: 'Préstamo Personal' },
    { value: 'carloan', label: 'Préstamo Auto' },
    { value: 'creditcard', label: 'Tarjeta de Crédito' },
    { value: 'studentloan', label: 'Préstamo Estudiantil' },
    { value: 'other', label: 'Otra Deuda' }
  ],
  activeIncome: [
    { value: 'salary', label: 'Salario' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'business', label: 'Negocio Activo' },
    { value: 'other', label: 'Otro' }
  ],
  livingExpense: [
    { value: 'rent', label: 'Alquiler/Hipoteca' },
    { value: 'utilities', label: 'Servicios' },
    { value: 'food', label: 'Alimentación' },
    { value: 'transport', label: 'Transporte' },
    { value: 'insurance', label: 'Seguros' },
    { value: 'health', label: 'Salud' },
    { value: 'other', label: 'Otro' }
  ]
};

function renderEditModal(item, config) {
  const isInvestment = currentCategory === 'investment' || currentCategory === 'passive';
  const types = ITEM_TYPES_MAP[currentCategory] || [];

  let additionalFields = '';

  if (config.fields.includes('value') && config.fields.includes('monthlyIncome')) {
    // Passive Asset
    additionalFields = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor Total</label>
          <input type="number" class="form-input" id="edit-value" value="${item.value || 0}" step="any" inputmode="decimal">
        </div>
        <div class="form-group">
          <label class="form-label">Ingreso Mensual</label>
          <input type="number" class="form-input" id="edit-monthly" value="${item.monthlyIncome || 0}" inputmode="numeric">
        </div>
      </div>
    `;
  } else if (config.fields.includes('value')) {
    // Investment Asset
    additionalFields = `
      <div class="form-group">
        <label class="form-label">Cantidad / Valor</label>
        <input type="number" class="form-input" id="edit-value" value="${item.value || 0}" step="any" inputmode="decimal">
      </div>
    `;
  } else if (config.fields.includes('amount') && config.fields.includes('monthlyPayment')) {
    // Liability
    additionalFields = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Monto Total</label>
          <input type="number" class="form-input" id="edit-amount" value="${item.amount || 0}" inputmode="numeric">
        </div>
        <div class="form-group">
          <label class="form-label">Pago Mensual</label>
          <input type="number" class="form-input" id="edit-monthly" value="${item.monthlyPayment || 0}" inputmode="numeric">
        </div>
      </div>
    `;
  } else if (config.fields.includes('amount')) {
    // Active Income or Living Expense
    const label = currentCategory === 'livingExpense' ? 'Gasto Mensual' : 'Ingreso Mensual';
    additionalFields = `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <input type="number" class="form-input" id="edit-amount" value="${item.amount || 0}" inputmode="numeric">
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

      <div class="form-row">
          <div class="form-group" style="flex: 1.5;">
              <label class="form-label">Tipo</label>
              <select class="form-input form-select" id="edit-type">
                  ${types.map(t => `<option value="${t.value}" ${t.value === item.type ? 'selected' : ''}>${t.label}</option>`).join('')}
              </select>
          </div>
          <div class="form-group" style="flex: 1;">
              <label class="form-label">Activo/Moneda</label>
              <select class="form-input form-select" id="edit-currency">
                  <optgroup label="Divisas">
                      ${CURRENCIES.map(c => `<option value="${c.value}" ${c.value === item.currency ? 'selected' : ''}>${c.label}</option>`).join('')}
                  </optgroup>
                  ${isInvestment ? `
                  <optgroup label="Mercados Reales">
                      ${MARKET_ASSETS.map(a => `<option value="${a.symbol}" ${a.symbol === item.currency ? 'selected' : ''}>${a.name} (${a.symbol})</option>`).join('')}
                  </optgroup>
                  ` : ''}
              </select>
          </div>
      </div>

      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input type="text" class="form-input" id="edit-name" value="${item.name || ''}">
      </div>
      
      ${additionalFields}
      
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
  const type = document.getElementById('edit-type')?.value;
  const currency = document.getElementById('edit-currency')?.value;
  const details = document.getElementById('edit-details')?.value?.trim();
  const value = parseFloat(document.getElementById('edit-value')?.value) || 0;
  const amount = parseFloat(document.getElementById('edit-amount')?.value) || 0;
  const monthly = parseFloat(document.getElementById('edit-monthly')?.value) || 0;

  if (!name) {
    ns.alert('Requerido', 'El nombre es obligatorio para guardar los cambios.');
    return;
  }

  const updates = { name, type, currency, details };

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
