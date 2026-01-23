/**
 * Compound Interest Calculator Page
 */

import { store } from '../store.js';
import { formatCurrency, formatCurrencyCompact } from '../utils/format.js';
import { getIcon } from '../utils/icons.js';

let currentYears = 10;
let currentRate = 7;
let currentPrincipal = null; // null means use store value
let currentAnnualContribution = null; // null means use store value

export function renderCompoundPage() {
  const state = store.getState();
  const symbol = state.currencySymbol;

  // Get initial values from store or use custom values
  const netWorth = store.getNetWorth();
  const monthlyNetIncome = store.getNetIncome();
  const defaultAnnualContribution = monthlyNetIncome * 12;

  // Use custom values if set, otherwise use defaults from store
  const principal = currentPrincipal !== null ? currentPrincipal : netWorth;
  const annualContribution = currentAnnualContribution !== null ? currentAnnualContribution : defaultAnnualContribution;

  // Calculate compound interest
  const results = calculateCompoundInterest(principal, annualContribution, currentRate, currentYears);

  return `
    <div class="compound-page stagger-children" style="padding-bottom: 80px;">
      <header class="page-header">
        <div style="display: flex; align-items: center; gap: var(--spacing-md);">
          <button class="back-btn" id="back-to-finance">
            ${getIcon('chevronLeft')}
          </button>
          <div>
            <h1 class="page-title">Interés Compuesto</h1>
            <p class="page-subtitle">Proyección de crecimiento patrimonial</p>
          </div>
        </div>
      </header>
      
      <!-- INPUT PARAMETERS -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Parámetros</span>
          ${getIcon('settings', 'card-icon')}
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Capital Inicial</label>
          <div class="compound-input-row">
            <span class="compound-input-prefix">${symbol}</span>
            <input type="number" class="compound-number-input" id="principal-input" 
                   value="${principal}" inputmode="numeric" placeholder="0">
            <button class="compound-reset-btn" id="reset-principal" title="Usar Patrimonio Neto">
              ${getIcon('home')}
            </button>
          </div>
          <div class="compound-input-hint">Patrimonio actual: ${formatCurrency(netWorth, symbol)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Aporte Anual</label>
          <div class="compound-input-row">
            <span class="compound-input-prefix">${symbol}</span>
            <input type="number" class="compound-number-input" id="contribution-input" 
                   value="${annualContribution}" inputmode="numeric" placeholder="0">
            <button class="compound-reset-btn" id="reset-contribution" title="Usar Ingreso Neto × 12">
              ${getIcon('zap')}
            </button>
          </div>
          <div class="compound-input-hint">Ingreso neto anual: ${formatCurrency(defaultAnnualContribution, symbol)}</div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Tasa de Interés Anual</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="rate-slider" min="1" max="20" value="${currentRate}" step="0.5">
            <span class="slider-value" id="rate-value">${currentRate}%</span>
          </div>
        </div>
        
        <div class="compound-input-group">
          <label class="compound-label">Años de Proyección</label>
          <div class="slider-container">
            <input type="range" class="compound-slider" id="years-slider" min="1" max="50" value="${currentYears}">
            <span class="slider-value" id="years-value">${currentYears} años</span>
          </div>
        </div>
      </div>
      
      <!-- FINAL RESULT -->
      <div class="card highlight-card">
        <div class="card-header">
          <span class="card-title" id="future-value-title">Valor Futuro en ${currentYears} años</span>
          ${getIcon('trendingUp', 'card-icon')}
        </div>
        <div class="highlight-value" id="future-value">${formatCurrency(results.finalValue, symbol)}</div>
        <div class="highlight-label" id="growth-label">
          ${results.totalGrowth >= 0 ? '📈' : '📉'} ${results.growthMultiple.toFixed(1)}x tu capital inicial
        </div>
      </div>
      
      <!-- BREAKDOWN -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Desglose</span>
          ${getIcon('coins', 'card-icon')}
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot asset"></span>
            Capital Inicial
          </span>
          <span class="stat-value neutral" id="initial-capital">${formatCurrency(principal, symbol)}</span>
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot income"></span>
            Total Aportado
          </span>
          <span class="stat-value ${results.totalContributions >= 0 ? 'positive' : 'negative'}" id="total-contributed">${formatCurrency(results.totalContributions, symbol)}</span>
        </div>
        
        <div class="stat-row">
          <span class="stat-label">
            <span class="stat-dot" style="background: var(--accent-secondary);"></span>
            Intereses Generados
          </span>
          <span class="stat-value" style="color: var(--accent-secondary);" id="total-interest">${formatCurrency(results.totalInterest, symbol)}</span>
        </div>
        
        <div class="stat-row" style="padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.1); margin-top: var(--spacing-sm);">
          <span class="stat-label" style="font-weight: 600; color: var(--text-primary);">
            Valor Final
          </span>
          <span class="stat-value positive" style="font-size: 20px;" id="final-value-breakdown">${formatCurrency(results.finalValue, symbol)}</span>
        </div>
      </div>
      
      <!-- YEAR BY YEAR PROJECTION -->
      <div class="section-divider">
        <span class="section-title">Proyección Año a Año</span>
      </div>
      
      <div class="projection-chart" id="projection-chart">
        ${renderProjectionBars(results.yearlyBreakdown, symbol)}
      </div>
      
      <div class="projection-table" id="projection-table">
        ${renderProjectionTable(results.yearlyBreakdown, symbol)}
      </div>
    </div>
  `;
}

function calculateCompoundInterest(principal, annualContribution, rate, years) {
  const r = rate / 100;
  const yearlyBreakdown = [];

  let balance = principal;
  let totalContributions = 0;
  let totalInterest = 0;

  for (let year = 1; year <= years; year++) {
    const startBalance = balance;
    const interest = balance * r;
    balance += interest + annualContribution;
    totalContributions += annualContribution;
    totalInterest += interest;

    yearlyBreakdown.push({
      year,
      startBalance,
      contribution: annualContribution,
      interest,
      endBalance: balance,
      totalContributions,
      totalInterest
    });
  }

  return {
    finalValue: balance,
    totalContributions,
    totalInterest,
    totalGrowth: balance - principal,
    growthMultiple: principal > 0 ? balance / principal : 0,
    yearlyBreakdown
  };
}

function renderProjectionBars(yearlyBreakdown, symbol) {
  if (yearlyBreakdown.length === 0) return '';

  const maxValue = Math.max(...yearlyBreakdown.map(y => Math.abs(y.endBalance)));
  const points = yearlyBreakdown.map((year, i) => {
    const x = (i / (yearlyBreakdown.length - 1)) * 100;
    const y = 100 - (year.endBalance / maxValue) * 100;
    return `${x},${y}`;
  });

  return `
    <div class="line-chart-container" style="height: 200px; width: 100%; position: relative; margin-top: 20px;">
      <svg viewBox="0 0 100 100" class="projection-line-chart" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
        <!-- Grid horizontal lines -->
        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" stroke-width="0.5" />
        
        <!-- Area under curve -->
        <path d="M0,100 L${points.join(' L')} L100,100 Z" fill="url(#chart-gradient)" opacity="0.2" />
        
        <!-- Main line -->
        <path d="M${points.join(' L')}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" />
        
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-primary)" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
        </defs>
      </svg>
      
      <!-- Labels -->
      <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; color: var(--text-muted);">
        <span>Año 0</span>
        <span>Año ${Math.floor(yearlyBreakdown.length / 2)}</span>
        <span>Año ${yearlyBreakdown.length}</span>
      </div>
    </div>
  `;
}

function renderProjectionTable(yearlyBreakdown, symbol) {
  // Show first 5, then every 5th year, then last year
  const yearsToShow = [];

  for (let i = 0; i < yearlyBreakdown.length; i++) {
    const year = yearlyBreakdown[i];
    if (i < 5 || (i + 1) % 5 === 0 || i === yearlyBreakdown.length - 1) {
      yearsToShow.push(year);
    }
  }

  return `
    <div class="table-container">
      <table class="projection-data-table">
        <thead>
          <tr>
            <th>Año</th>
            <th>Balance</th>
            <th>Interés</th>
          </tr>
        </thead>
        <tbody>
          ${yearsToShow.map(year => `
            <tr>
              <td>${year.year}</td>
              <td class="${year.endBalance >= 0 ? 'positive' : 'negative'}">${formatCurrency(year.endBalance, symbol)}</td>
              <td style="color: var(--accent-secondary);">+${formatCurrency(year.interest, symbol)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function setupCompoundPageListeners(onBack) {
  const backBtn = document.getElementById('back-to-finance');
  const rateSlider = document.getElementById('rate-slider');
  const yearsSlider = document.getElementById('years-slider');
  const principalInput = document.getElementById('principal-input');
  const contributionInput = document.getElementById('contribution-input');
  const resetPrincipalBtn = document.getElementById('reset-principal');
  const resetContributionBtn = document.getElementById('reset-contribution');

  if (backBtn) {
    backBtn.addEventListener('click', onBack);
  }

  if (principalInput) {
    principalInput.addEventListener('input', (e) => {
      currentPrincipal = parseFloat(e.target.value) || 0;
      updateCalculations();
    });
  }

  if (contributionInput) {
    contributionInput.addEventListener('input', (e) => {
      currentAnnualContribution = parseFloat(e.target.value) || 0;
      updateCalculations();
    });
  }

  if (resetPrincipalBtn) {
    resetPrincipalBtn.addEventListener('click', () => {
      currentPrincipal = null;
      const netWorth = store.getNetWorth();
      principalInput.value = netWorth;
      updateCalculations();
    });
  }

  if (resetContributionBtn) {
    resetContributionBtn.addEventListener('click', () => {
      currentAnnualContribution = null;
      const annualContribution = store.getNetIncome() * 12;
      contributionInput.value = annualContribution;
      updateCalculations();
    });
  }

  if (rateSlider) {
    rateSlider.addEventListener('input', (e) => {
      currentRate = parseFloat(e.target.value);
      document.getElementById('rate-value').textContent = `${currentRate}%`;
      updateCalculations();
    });
  }

  if (yearsSlider) {
    yearsSlider.addEventListener('input', (e) => {
      currentYears = parseInt(e.target.value);
      document.getElementById('years-value').textContent = `${currentYears} años`;
      updateCalculations();
    });
  }
}

function updateCalculations() {
  const state = store.getState();
  const symbol = state.currencySymbol;

  // Get current values
  const principal = currentPrincipal !== null ? currentPrincipal : store.getNetWorth();
  const annualContribution = currentAnnualContribution !== null ? currentAnnualContribution : store.getNetIncome() * 12;

  const results = calculateCompoundInterest(principal, annualContribution, currentRate, currentYears);

  // Update values in DOM
  const futureValueEl = document.getElementById('future-value');
  const futureValueTitleEl = document.getElementById('future-value-title');
  const growthLabelEl = document.getElementById('growth-label');
  const initialCapitalEl = document.getElementById('initial-capital');
  const totalContributedEl = document.getElementById('total-contributed');
  const totalInterestEl = document.getElementById('total-interest');
  const finalValueBreakdownEl = document.getElementById('final-value-breakdown');
  const projectionChartEl = document.getElementById('projection-chart');
  const projectionTableEl = document.getElementById('projection-table');

  if (futureValueEl) futureValueEl.textContent = formatCurrency(results.finalValue, symbol);
  if (futureValueTitleEl) futureValueTitleEl.textContent = `Valor Futuro en ${currentYears} años`;
  if (growthLabelEl) {
    growthLabelEl.innerHTML = `${results.totalGrowth >= 0 ? '📈' : '📉'} ${results.growthMultiple.toFixed(1)}x tu capital inicial`;
  }
  if (initialCapitalEl) initialCapitalEl.textContent = formatCurrency(principal, symbol);
  if (totalContributedEl) {
    totalContributedEl.textContent = formatCurrency(results.totalContributions, symbol);
    totalContributedEl.className = `stat-value ${results.totalContributions >= 0 ? 'positive' : 'negative'}`;
  }
  if (totalInterestEl) totalInterestEl.textContent = formatCurrency(results.totalInterest, symbol);
  if (finalValueBreakdownEl) finalValueBreakdownEl.textContent = formatCurrency(results.finalValue, symbol);
  if (projectionChartEl) projectionChartEl.innerHTML = renderProjectionBars(results.yearlyBreakdown, symbol);
  if (projectionTableEl) projectionTableEl.innerHTML = renderProjectionTable(results.yearlyBreakdown, symbol);
}

// Reset to defaults when leaving page
export function resetCompoundPage() {
  currentYears = 10;
  currentRate = 7;
  currentPrincipal = null;
  currentAnnualContribution = null;
}
