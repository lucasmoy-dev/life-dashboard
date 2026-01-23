/**
 * Add Item Modal - For adding new assets, incomes, expenses, or liabilities
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { MARKET_ASSETS } from '../services/MarketService.js';
import { ns } from '../utils/notifications.js';

const ITEM_TYPES = {
  passiveAsset: {
    label: 'Ingresos Pasivos',
    icon: 'building',
    types: [
      { value: 'rental', label: 'Inmueble en Renta' },
      { value: 'stocks', label: 'Acciones/Dividendos' },
      { value: 'etf', label: 'ETF/Fondos' },
      { value: 'bonds', label: 'Bonos' },
      { value: 'crypto', label: 'Crypto Staking' },
      { value: 'business', label: 'Negocio Pasivo' },
      { value: 'royalties', label: 'Regalías' },
      { value: 'other', label: 'Otro' }
    ]
  },
  activeIncome: {
    label: 'Ingreso Activo',
    icon: 'briefcase',
    types: [
      { value: 'salary', label: 'Salario' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'business', label: 'Negocio Activo' },
      { value: 'other', label: 'Otro' }
    ]
  },
  livingExpense: {
    label: 'Gasto de Vida',
    icon: 'receipt',
    types: [
      { value: 'rent', label: 'Alquiler/Hipoteca' },
      { value: 'utilities', label: 'Servicios' },
      { value: 'food', label: 'Alimentación' },
      { value: 'transport', label: 'Transporte' },
      { value: 'insurance', label: 'Seguros' },
      { value: 'health', label: 'Salud' },
      { value: 'other', label: 'Otro' }
    ]
  },
  investmentAsset: {
    label: 'Activo de Inversión',
    icon: 'trendingUp',
    types: [
      { value: 'property', label: 'Inmueble' },
      { value: 'stocks', label: 'Acciones' },
      { value: 'etf', label: 'ETF/Fondos' },
      { value: 'crypto', label: 'Criptomoneda' },
      { value: 'cash', label: 'Efectivo/Ahorro' },
      { value: 'vehicle', label: 'Vehículo' },
      { value: 'collectibles', label: 'Coleccionables' },
      { value: 'other', label: 'Otro' }
    ]
  },
  liability: {
    label: 'Pasivo/Deuda',
    icon: 'creditCard',
    types: [
      { value: 'mortgage', label: 'Hipoteca' },
      { value: 'loan', label: 'Préstamo Personal' },
      { value: 'carloan', label: 'Préstamo Auto' },
      { value: 'creditcard', label: 'Tarjeta de Crédito' },
      { value: 'studentloan', label: 'Préstamo Estudiantil' },
      { value: 'other', label: 'Otra Deuda' }
    ]
  },
  event: {
    label: 'Evento/Cita',
    icon: 'calendar',
    types: [
      { value: 'event', label: 'Evento Puntual' },
      { value: 'reminder', label: 'Recordatorio' },
      { value: 'meeting', label: 'Reunión' },
      { value: 'other', label: 'Otro' }
    ]
  }
};

const CURRENCIES = [
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'Dólar ($)' },
  { value: 'CHF', label: 'Franco Suizo (Fr)' },
  { value: 'GBP', label: 'Libra (£)' },
  { value: 'AUD', label: 'Dólar Aus. (A$)' },
  { value: 'ARS', label: 'Peso Arg. ($)' }
];

let currentCategory = 'passiveAsset';
let currentSubtype = '';
let modalElement = null;

export function openAddModal(initialCategory = 'passiveAsset') {
  currentCategory = initialCategory;
  currentSubtype = ITEM_TYPES[currentCategory]?.types[0]?.value || '';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'add-modal';
  overlay.innerHTML = renderModal();

  document.body.appendChild(overlay);
  modalElement = overlay;

  // Trigger animation
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  setupModalListeners();
}

function renderModal() {
  const title = currentCategory === 'event' ? 'Agregar Evento' : 'Agregar Elemento';
  return `
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" id="modal-close">
          ${getIcon('x')}
        </button>
      </div>
      
      <!-- Category Selector (Only shown for non-event items) -->
      ${currentCategory !== 'event' ? `
      <div class="form-label" style="margin-top: var(--spacing-sm);">Categoría</div>
      <div class="type-selector category-selector">
        ${Object.entries(ITEM_TYPES).map(([key, data]) => `
          <div class="type-option ${key === currentCategory ? 'active' : ''}" data-category="${key}">
            <div class="type-option-icon-wrapper">
                ${getIcon(data.icon)}
            </div>
            <div class="type-option-label">${data.label.split('/')[0]}</div>
          </div>
        `).join('')}
      </div>` : ''}
      
      <!-- Dynamic Form -->
      <div id="form-container" style="margin-top: var(--spacing-lg);">
        ${renderForm()}
      </div>
    </div>
  `;
}

function renderForm() {
  const categoryData = ITEM_TYPES[currentCategory];
  const isInvestment = currentCategory === 'investmentAsset' || currentCategory === 'passiveAsset';

  let assetOptions = CURRENCIES;
  if (isInvestment) {
    // Merge known market assets for these categories
    const marketAssetOptions = MARKET_ASSETS.map(a => ({ value: a.symbol, label: `${a.name} (${a.symbol})` }));
    assetOptions = [...CURRENCIES, ...marketAssetOptions];
  }

  let additionalFields = '';

  if (currentCategory === 'passiveAsset') {
    additionalFields = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor Total</label>
          <input type="number" class="form-input" id="input-value" placeholder="0" inputmode="numeric">
        </div>
        <div class="form-group">
          <label class="form-label">Ingreso Mensual</label>
          <input type="number" class="form-input" id="input-monthly" placeholder="0" inputmode="numeric">
        </div>
      </div>
    `;
  } else if (currentCategory === 'activeIncome' || currentCategory === 'livingExpense') {
    additionalFields = `
      <div class="form-group">
        <label class="form-label">Monto Mensual</label>
        <input type="number" class="form-input" id="input-amount" placeholder="0" inputmode="numeric">
      </div>
    `;
  } else if (currentCategory === 'investmentAsset') {
    additionalFields = `
      <div class="form-group">
        <label class="form-label">Cantidad / Valor</label>
        <input type="number" class="form-input" id="input-value" placeholder="0" step="any" inputmode="decimal">
      </div>
    `;
  } else if (currentCategory === 'liability') {
    additionalFields = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Monto Total</label>
          <input type="number" class="form-input" id="input-amount" placeholder="0" inputmode="numeric">
        </div>
        <div class="form-group">
          <label class="form-label">Pago Mensual</label>
          <input type="number" class="form-input" id="input-monthly" placeholder="0" inputmode="numeric">
        </div>
      </div>
    `;
  } else if (currentCategory === 'event') {
    const today = new Date().toISOString().split('T')[0];
    additionalFields = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Fecha</label>
          <input type="date" class="form-input" id="input-date" value="${today}">
        </div>
        <div class="form-group">
          <label class="form-label">Hora</label>
          <input type="time" class="form-input" id="input-time" value="09:00">
        </div>
      </div>
      <div class="form-group">
          <label class="form-label">Repetición</label>
          <select class="form-input form-select" id="input-repeat">
              <option value="none">No repetir</option>
              <option value="daily">Cada día</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
          </select>
      </div>
    `;
  }

  return `
    <div class="form-row">
        <div class="form-group" style="flex: 1.5;">
            <label class="form-label">Tipo</label>
            <select class="form-input form-select" id="input-type">
                ${categoryData.types.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
            </select>
        </div>
        <div class="form-group" style="flex: 1.5;">
            <label class="form-label">Activo/Moneda</label>
            <select class="form-input form-select" id="input-currency">
                <optgroup label="Divisas">
                    ${CURRENCIES.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
                </optgroup>
                ${isInvestment ? `
                <optgroup label="Mercados Reales (Auto-Price)">
                    ${MARKET_ASSETS.map(a => `<option value="${a.symbol}">${a.name} (${a.symbol})</option>`).join('')}
                </optgroup>
                ` : ''}
            </select>
        </div>
    </div>
    
    <div class="form-group">
      <label class="form-label">Nombre</label>
      <input type="text" class="form-input" id="input-name" placeholder="Ej: Mi Wallet BTC">
    </div>
    
    ${additionalFields}
    
    <div class="form-group">
      <label class="form-label">Detalles (opcional)</label>
      <input type="text" class="form-input" id="input-details" placeholder="Notas adicionales...">
    </div>
    
    <button class="btn btn-primary" id="btn-save" style="margin-top: var(--spacing-md);">
      ${getIcon('plus')} Agregar
    </button>
  `;
}

function setupModalListeners() {
  const overlay = document.getElementById('add-modal');
  const closeBtn = document.getElementById('modal-close');

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  closeBtn.addEventListener('click', closeModal);

  const categoryOptions = overlay.querySelectorAll('.category-selector .type-option');
  categoryOptions.forEach(option => {
    option.addEventListener('click', () => {
      currentCategory = option.dataset.category;
      categoryOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      document.getElementById('form-container').innerHTML = renderForm();
      setupFormListeners();
    });
  });

  setupFormListeners();
}

function setupFormListeners() {
  const saveBtn = document.getElementById('btn-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', handleSave);
  }

  // Auto-fill name when currency/asset changes
  const assetSelect = document.getElementById('input-currency');
  const nameInput = document.getElementById('input-name');
  if (assetSelect && nameInput) {
    assetSelect.addEventListener('change', () => {
      if (!nameInput.value) {
        const selectedText = assetSelect.options[assetSelect.selectedIndex].text;
        nameInput.value = selectedText.split(' (')[0];
      }
    });
  }
}

function handleSave() {
  const name = document.getElementById('input-name')?.value?.trim();
  const type = document.getElementById('input-type')?.value;
  const currency = document.getElementById('input-currency')?.value;
  const details = document.getElementById('input-details')?.value?.trim();
  const value = parseFloat(document.getElementById('input-value')?.value) || 0;
  const amount = parseFloat(document.getElementById('input-amount')?.value) || 0;
  const monthly = parseFloat(document.getElementById('input-monthly')?.value) || 0;
  const date = document.getElementById('input-date')?.value;
  const time = document.getElementById('input-time')?.value;
  const repeat = document.getElementById('input-repeat')?.value;

  if (!name) {
    ns.alert('Campo Obligatorio', 'Por favor ingresa un nombre para el elemento.');
    return;
  }

  const baseData = { name, type, currency, details };

  switch (currentCategory) {
    case 'passiveAsset':
      store.addPassiveAsset({ ...baseData, value, monthlyIncome: monthly });
      break;
    case 'activeIncome':
      store.addActiveIncome({ ...baseData, amount });
      break;
    case 'livingExpense':
      store.addLivingExpense({ ...baseData, amount });
      break;
    case 'investmentAsset':
      store.addInvestmentAsset({ ...baseData, value });
      break;
    case 'liability':
      store.addLiability({ ...baseData, amount, monthlyPayment: monthly });
      break;
    case 'event':
      store.addEvent({ title: name, date, time, repeat, category: type });
      break;
  }

  closeModal();
}

function closeModal() {
  const overlay = document.getElementById('add-modal');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  }
}
