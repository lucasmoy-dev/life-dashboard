/**
 * Finance Page - Main financial dashboard
 */

import { store } from '../store.js';
import { formatCurrency } from '../utils/format.js';
import { getIcon } from '../utils/icons.js';
import { openEditModal } from '../components/EditModal.js';
import { renderMarketView, setupMarketViewListeners } from '../components/Finance/MarketView.js';
import { hideFAB, showFAB } from '../main.js';

let currentTab = 'summary'; // 'summary' | 'markets'

export function renderFinancePage() {
  const state = store.getState();
  const symbol = state.currencySymbol;

  // Handle FAB visibility on render
  if (currentTab === 'markets') {
    setTimeout(hideFAB, 0);
  } else {
    setTimeout(showFAB, 0);
  }

  return `
    <div class="finance-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header" style="margin-bottom: var(--spacing-md);">
        <h1 class="page-title">Finance</h1>
        <p class="page-subtitle">Tu panorama financiero</p>
      </header>
      
      <!-- Finance Tabs (Segmented Control) -->
      <div class="segmented-control">
        <button class="segment-btn ${currentTab === 'summary' ? 'active' : ''}" id="tab-summary">
            Summary
        </button>
        <button class="segment-btn ${currentTab === 'markets' ? 'active' : ''}" id="tab-markets">
            Markets
        </button>
      </div>
      
      ${currentTab === 'summary' ? renderSummaryView(state, symbol) : renderMarketView()}
      
    </div>
  `;
}

function renderSummaryView(state, symbol) {
  // Calculate all values (already converted to display currency by sumItems)
  const passiveIncome = store.getPassiveIncome();
  const livingExpenses = store.getLivingExpenses();
  const netPassiveIncome = store.getNetPassiveIncome();

  const investmentAssets = store.getInvestmentAssetsValue();
  const liabilities = store.getTotalLiabilities();
  const netWorth = store.getNetWorth();

  const allIncomes = store.getAllIncomes();
  const allExpenses = store.getAllExpenses();
  const netIncome = store.getNetIncome();

  return `
      <div class="finance-top-grid animate-fade-in">
        <!-- PRIMARY METRICS -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Flujo Pasivo Mensual</span>
            ${getIcon('zap', 'card-icon')}
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot income"></span>
              Ingresos Pasivos
            </span>
            <span class="stat-value positive">${formatCurrency(passiveIncome, symbol)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">
              <span class="stat-dot expense"></span>
              Gastos de Vida
            </span>
            <span class="stat-value negative">${formatCurrency(livingExpenses, symbol)}</span>
          </div>
        </div>
        
        <!-- HIGHLIGHT: NET PASSIVE INCOME -->
        <div class="card highlight-card ${netPassiveIncome < 0 ? 'highlight-card-negative' : ''}">
          <div class="card-header">
            <span class="card-title">Ingreso Pasivo Neto</span>
            ${getIcon('piggyBank', 'card-icon')}
          </div>
          <div class="highlight-value ${netPassiveIncome < 0 ? 'highlight-value-negative' : ''}">${formatCurrency(netPassiveIncome, symbol)}</div>
          <div class="highlight-label ${netPassiveIncome < 0 ? 'highlight-label-negative' : ''}">
            ${netPassiveIncome >= 0
      ? '🎉 ¡Libertad financiera alcanzada!'
      : `Faltan ${formatCurrency(Math.abs(netPassiveIncome), symbol)}/mes`}
          </div>
        </div>
      </div>
      
      <!-- BALANCE SHEET -->
      <div class="section-divider">
        <span class="section-title">Balance Patrimonial</span>
      </div>
      
      <div class="finance-balance-grid">
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value text-primary-accent">${formatCurrency(investmentAssets, symbol)}</div>
            <div class="summary-label">Activos</div>
          </div>
          <div class="summary-item">
            <div class="summary-value text-warning">${formatCurrency(liabilities, symbol)}</div>
            <div class="summary-label">Pasivos</div>
          </div>
        </div>
        
        <div class="card net-worth-card">
          <div class="card-header">
            <span class="card-title">Patrimonio Neto</span>
            ${getIcon('scale', 'card-icon')}
          </div>
          <div class="stat-value ${netWorth >= 0 ? 'positive' : 'negative'}" style="font-size: 32px; font-weight: 800; text-align: center; margin-top: var(--spacing-sm);">
            ${formatCurrency(netWorth, symbol)}
          </div>
        </div>
      </div>
      
      <!-- CASH FLOW -->
      <div class="section-divider">
        <span class="section-title">Flujo de Efectivo Mensual</span>
      </div>
      
      <div class="card">
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot income"></span>
            Todos los Ingresos
          </span>
          <span class="stat-value positive">${formatCurrency(allIncomes, symbol)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot expense"></span>
            Todos los Gastos
          </span>
          <span class="stat-value negative">${formatCurrency(allExpenses, symbol)}</span>
        </div>
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Ingreso Neto
          </span>
          <span class="stat-value ${netIncome >= 0 ? 'positive' : 'negative'}" style="font-size: 20px;">
            ${formatCurrency(netIncome, symbol)}
          </span>
        </div>
      </div>
      
      <div class="finance-links-grid">
        <button class="compound-link-btn" id="open-expenses" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%); border-color: rgba(239, 68, 68, 0.3);">
          <div class="compound-link-content">
            <div class="compound-link-icon" style="background: rgba(239,68,68,0.2); color: var(--accent-danger);">
              ${getIcon('creditCard')}
            </div>
            <div class="compound-link-text">
              <div class="compound-link-title">Ver Gastos Mensuales</div>
              <div class="compound-link-subtitle">Detalle de salidas y deudas</div>
            </div>
          </div>
          <div class="compound-link-arrow">
            ${getIcon('chevronRight')}
          </div>
        </button>

        <!-- COMPOUND INTEREST CALCULATOR LINK -->
        <button class="compound-link-btn" id="open-compound">
          <div class="compound-link-content">
            <div class="compound-link-icon">
              ${getIcon('calculator')}
            </div>
            <div class="compound-link-text">
              <div class="compound-link-title">Calculadora de Interés Compuesto</div>
              <div class="compound-link-subtitle">Proyecta el crecimiento de tu patrimonio</div>
            </div>
          </div>
          <div class="compound-link-arrow">
            ${getIcon('chevronRight')}
          </div>
        </button>
      </div>

      <!-- ALLOCATION CHART -->
      <div class="section-divider">
        <span class="section-title">Distribución de Activos</span>
      </div>
      
      ${renderAllocationChart(state)}

      <!-- ASSETS LIST -->
      <div class="section-divider">
        <span class="section-title">Ingreso Pasivo & Cartera</span>
      </div>
      
      ${renderAssetsList(state)}

      <!-- FOOTER BUTTONS & SETTINGS -->
      <div class="section-divider">
        <span class="section-title">Configuración</span>
      </div>

      <div class="footer-actions">
        <div class="card" style="margin-top: var(--spacing-md); padding: var(--spacing-md) !important;">
            <div class="footer-setting-row">
                <div class="setting-info">
                    <div class="setting-label">Divisa de Visualización</div>
                    <div class="setting-desc">Toda la plataforma cambiará a esta moneda</div>
                </div>
                <div class="premium-select-wrapper">
                    <select class="premium-select" id="display-currency-select">
                        <option value="EUR" ${state.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                        <option value="USD" ${state.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                        <option value="CHF" ${state.currency === 'CHF' ? 'selected' : ''}>CHF (Fr)</option>
                        <option value="GBP" ${state.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                        <option value="AUD" ${state.currency === 'AUD' ? 'selected' : ''}>AUD (A$)</option>
                        <option value="ARS" ${state.currency === 'ARS' ? 'selected' : ''}>ARS ($)</option>
                        <option value="BTC" ${state.currency === 'BTC' ? 'selected' : ''}>BTC (₿)</option>
                    </select>
                    <div class="premium-select-icon">
                        ${getIcon('chevronDown', 'tiny-icon')}
                    </div>
                </div>
            </div>
        </div>
      </div>
  `;
}

function renderAllocationChart(state) {
  const allAssets = [...state.passiveAssets, ...state.investmentAssets];
  const allLiabilities = state.liabilities;
  if (allAssets.length === 0) return '';


  const sectors = {
    'Bitcoin': { value: 0, color: '#f59e0b' },
    'Altcoins': { value: 0, color: '#6366f1' },
    'Inmuebles': { value: 0, color: '#a855f7' },
    'Bolsa': { value: 0, color: '#00d4aa' },
    'Oro': { value: 0, color: '#fbbf24' },
    'Otros/Efe.': { value: 0, color: '#94a3b8' }
  };

  allAssets.forEach(asset => {
    // We use converted values to current display currency
    const value = store.convertValue(asset.value || 0, asset.currency || 'EUR');

    if (asset.currency === 'BTC') {
      sectors['Bitcoin'].value += value;
    } else if (asset.currency === 'ETH' || asset.currency === 'XRP' || asset.type === 'crypto') {
      sectors['Altcoins'].value += value;
    } else if (asset.type === 'property' || asset.type === 'rental') {
      sectors['Inmuebles'].value += value;
    } else if (asset.type === 'stocks' || asset.type === 'etf' || asset.currency === 'SP500') {
      sectors['Bolsa'].value += value;
    } else if (asset.currency === 'GOLD') {
      sectors['Oro'].value += value;
    } else {
      sectors['Otros/Efe.'].value += value;
    }
  });

  // Subtract mortgage from Real Estate
  const mortgageTotal = allLiabilities
    .filter(l => l.type === 'mortgage')
    .reduce((sum, l) => sum + store.convertValue(l.amount || 0, l.currency || 'EUR'), 0);

  sectors['Inmuebles'].value = Math.max(0, sectors['Inmuebles'].value - mortgageTotal);

  // If hideRealEstate is active, zero out the sector
  if (state.hideRealEstate) {
    sectors['Inmuebles'].value = 0;
  }

  const sectorsToChart = Object.entries(sectors)
    .filter(([_, data]) => data.value > 0)
    .sort((a, b) => b[1].value - a[1].value);

  const totalValue = sectorsToChart.reduce((sum, [_, data]) => sum + data.value, 0);

  if (totalValue === 0) {
    return `
      <div class="card allocation-card" style="text-align: center; padding: var(--spacing-xl) !important;">
         <div class="toggle-row" style="justify-content: center;">
            <label class="toggle-label" style="font-size: 13px;">Ocultar Inmuebles</label>
            <input type="checkbox" id="toggle-real-estate" ${state.hideRealEstate ? 'checked' : ''}>
        </div>
        <p style="margin-top: var(--spacing-md); color: var(--text-muted); font-size: 14px;">No hay otros activos para mostrar.</p>
      </div>
    `;
  }

  let accumulated = 0;
  const piePaths = sectorsToChart.map(([name, data]) => {
    const percentage = (data.value / totalValue) * 100;
    const start = accumulated;
    accumulated += percentage;
    return { name, percentage, color: data.color, start };
  });

  const conicParts = piePaths.map(p => {
    return `${p.color} ${p.start}% ${p.start + p.percentage}%`;
  }).join(', ');

  return `
    <div class="card allocation-card">
      <div class="card-header" style="margin-bottom: var(--spacing-lg);">
        <div class="toggle-row" style="width: 100%; justify-content: space-between;">
            <label class="toggle-label" style="font-size: 13px; font-weight: 500;">Ocultar Inmuebles (Neto)</label>
            <input type="checkbox" id="toggle-real-estate" class="apple-switch" ${state.hideRealEstate ? 'checked' : ''}>
        </div>
      </div>
      <div class="allocation-container">
        <div class="pie-chart" style="background: conic-gradient(${conicParts});">
          <div class="pie-center">
            <div class="pie-total">${formatCurrency(totalValue, state.currencySymbol)}</div>
            <div class="pie-total-label">Total Neto</div>
          </div>
        </div>
        <div class="allocation-legend">
          ${piePaths.map(p => `
            <div class="legend-item">
              <div class="legend-color" style="background: ${p.color};"></div>
              <div class="legend-info">
                <span class="legend-name">${p.name}</span>
                <span class="legend-pct">${p.percentage.toFixed(1)}%</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderAssetsList(state) {
  const allItems = [
    ...state.passiveAssets.map(a => ({ ...a, category: 'passive' })),
    ...state.investmentAssets.map(a => ({ ...a, category: 'investment' })),
    ...state.liabilities.map(l => ({ ...l, category: 'liability' }))
  ];

  if (allItems.length === 0) {
    return `
      <div class="empty-state">
        ${getIcon('package', 'empty-icon')}
        <div class="empty-title">Sin activos registrados</div>
        <p class="empty-description">
          Toca el botón + para agregar tus propiedades, inversiones, deudas y más.
        </p>
      </div>
    `;
  }

  const baseSymbol = state.currencySymbol;

  return `
    <div class="asset-list">
      ${allItems.map(item => {
    const iconClass = getAssetIconClass(item.currency || item.type);
    const icon = getAssetIcon(item.currency || item.type);
    const isLiability = item.category === 'liability';

    // Calculate display value converted from original currency
    const rawValue = item.value || item.amount || 0;
    const displayValue = store.convertValue(rawValue, item.currency || 'EUR');

    // Determine how to show original currency
    let originalDisplay = '';
    if (item.currency !== state.currency) {
      const currenciesWithSymbols = { EUR: '€', USD: '$', BTC: '₿', ETH: 'Ξ', XRP: '✕', GOLD: 'oz', SP500: 'pts', CHF: 'Fr', GBP: '£', AUD: 'A$', ARS: '$' };
      const sym = currenciesWithSymbols[item.currency] || item.currency;
      originalDisplay = `<div class="asset-original-value">${rawValue} ${sym}</div>`;
    }

    return `
          <div class="asset-item" data-id="${item.id}" data-category="${item.category}">
            <div class="asset-icon-wrapper ${iconClass}">
              ${getIcon(icon, 'asset-icon')}
            </div>
            <div class="asset-info">
              <div class="asset-name">${item.name}</div>
              <div class="asset-details">${item.details || item.type || ''}</div>
              ${originalDisplay}
            </div>
            <div>
              <div class="asset-value ${isLiability ? 'text-warning' : ''}">
                ${isLiability ? '-' : ''}${formatCurrency(displayValue, baseSymbol)}
              </div>
              ${item.monthlyIncome ? `<div class="asset-yield">+${formatCurrency(store.convertValue(item.monthlyIncome, item.currency), baseSymbol)}/mes</div>` : ''}
              ${item.monthlyPayment ? `<div class="asset-yield text-negative">-${formatCurrency(store.convertValue(item.monthlyPayment, item.currency), baseSymbol)}/mes</div>` : ''}
            </div>
          </div>
        `;
  }).join('')}
    </div>
  `;
}

function getAssetIconClass(typeOrCurrency) {
  const map = {
    'property': 'property',
    'rental': 'property',
    'stocks': 'stocks',
    'etf': 'stocks',
    'SP500': 'stocks',
    'crypto': 'crypto',
    'BTC': 'crypto',
    'ETH': 'crypto',
    'XRP': 'crypto',
    'GOLD': 'investment',
    'cash': 'cash',
    'USD': 'cash',
    'EUR': 'cash',
    'savings': 'cash',
    'vehicle': 'vehicle',
    'debt': 'debt',
    'loan': 'debt',
    'mortgage': 'debt',
    'creditcard': 'debt'
  };
  return map[typeOrCurrency] || 'cash';
}

function getAssetIcon(typeOrCurrency) {
  const map = {
    'property': 'building',
    'rental': 'building',
    'stocks': 'trendingUp',
    'etf': 'trendingUp',
    'SP500': 'trendingUp',
    'crypto': 'bitcoin',
    'BTC': 'bitcoin',
    'ETH': 'bitcoin',
    'XRP': 'bitcoin',
    'GOLD': 'package',
    'cash': 'dollarSign',
    'USD': 'dollarSign',
    'EUR': 'dollarSign',
    'savings': 'piggyBank',
    'vehicle': 'car',
    'debt': 'creditCard',
    'loan': 'landmark',
    'mortgage': 'home',
    'creditcard': 'creditCard'
  };
  return map[typeOrCurrency] || 'dollarSign';
}

// Setup event listeners for asset items
export function setupFinancePageListeners() {
  // Tab Listeners
  const tabSummary = document.getElementById('tab-summary');
  const tabMarkets = document.getElementById('tab-markets');

  if (tabSummary && tabMarkets) {
    tabSummary.addEventListener('click', () => {
      currentTab = 'summary';
      window.reRender?.();
    });
    tabMarkets.addEventListener('click', () => {
      currentTab = 'markets';
      window.reRender?.();
    });
  }

  if (currentTab === 'markets') {
    setupMarketViewListeners();
    return;
  }

  const assetItems = document.querySelectorAll('.asset-item');
  assetItems.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const category = item.dataset.category;
      openEditModal(id, category);
    });
  });

  const toggleRealEstate = document.getElementById('toggle-real-estate');
  if (toggleRealEstate) {
    toggleRealEstate.addEventListener('change', () => {
      store.toggleRealEstate();
    });
  }

  const currencySelect = document.getElementById('display-currency-select');
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      store.setCurrency(e.target.value);
    });
  }
}
