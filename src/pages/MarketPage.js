/**
 * World Markets Page
 */

import { fetchMarketData, ASSET_CATEGORIES } from '../services/MarketService.js';
import { store } from '../store.js';
import { formatCurrency, formatPercentage } from '../utils/format.js';
import { getIcon } from '../utils/icons.js';

let marketData = store.getState().lastMarketData || [];
let isLoading = false;
let sortConfig = { key: 'price', direction: 'desc' };
let currentMarketCurrency = '';

export function renderMarketPage() {
    const state = store.getState();
    const currency = state.currency || 'EUR';
    const symbol = state.currencySymbol || '€';

    // Refresh if currency changed or no data
    if (marketData.length === 0 || currentMarketCurrency !== currency) {
        if (!isLoading) {
            loadData();
        }
        if (marketData.length === 0) {
            return `
                <div class="market-page">
                    <header class="page-header">
                        <h1 class="page-title">Mercados del Mundo</h1>
                        <p class="page-subtitle">Precios y tendencias globales</p>
                    </header>
                    <div class="empty-state">
                        <div class="loading-spinner"></div>
                        <p class="empty-description">Cargando datos reales de mercado...</p>
                    </div>
                </div>
            `;
        }
    }

    const categories = Object.values(ASSET_CATEGORIES);

    return `
        <div class="market-page stagger-children" style="padding-bottom: 80px;">
            <header class="page-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <button class="back-btn" id="market-back">
                            ${getIcon('chevronLeft')}
                        </button>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <h1 class="page-title">Mercados del Mundo</h1>
                                ${isLoading ? `
                                    <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,212,170,0.1); padding: 4px 10px; border-radius: 20px;">
                                        <div class="loading-spinner-sm" style="width:10px; height:10px; border-width: 1.5px; border-color: var(--accent-primary) transparent var(--accent-primary) transparent;"></div>
                                        <span style="font-size: 10px; color: var(--accent-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Actualizando</span>
                                    </div>
                                ` : ''}
                            </div>
                            <p class="page-subtitle">Activos globales en ${currency}</p>
                        </div>
                    </div>
                    
                    <div class="market-currency-toggle" style="background: rgba(255,255,255,0.05); padding: 5px; border-radius: var(--radius-md); display: flex; gap: 6px;">
                        <button class="btn-toggle ${currency === 'EUR' ? 'active' : ''}" data-curr="EUR" style="padding: 8px 16px; font-size: 14px; border-radius: 8px; border: none; cursor: pointer; background: ${currency === 'EUR' ? 'var(--accent-primary)' : 'transparent'}; color: ${currency === 'EUR' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; font-weight: 700;">EUR</button>
                        <button class="btn-toggle ${currency === 'USD' ? 'active' : ''}" data-curr="USD" style="padding: 8px 16px; font-size: 14px; border-radius: 8px; border: none; cursor: pointer; background: ${currency === 'USD' ? 'var(--accent-primary)' : 'transparent'}; color: ${currency === 'USD' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; font-weight: 700;">USD</button>
                    </div>
                </div>
            </header>

            ${categories.map(cat => {
        const catData = marketData.filter(a => a.category === cat);
        if (catData.length === 0) return '';
        return renderCategoryTable(cat, catData, symbol);
    }).join('')}
        </div>
    `;
}

function renderCategoryTable(categoryName, data, symbol) {
    // Sort category data
    const sortedData = [...data].sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return `
        <div class="market-section" style="margin-bottom: var(--spacing-xl);">
            <h2 class="section-title" style="margin-left: 0; margin-bottom: var(--spacing-md); color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                ${categoryName}
            </h2>
            <div class="card market-table-card" style="padding: 0 !important; overflow: hidden; background: rgba(22, 33, 62, 0.4);">
                <div class="table-container market-table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th data-sort="name" class="${sortConfig.key === 'name' ? 'active ' + sortConfig.direction : ''}" style="padding-left: var(--spacing-md);">Activo</th>
                                <th data-sort="price" class="${sortConfig.key === 'price' ? 'active ' + sortConfig.direction : ''}">Precio</th>
                                <th data-sort="change24h" class="${sortConfig.key === 'change24h' ? 'active ' + sortConfig.direction : ''}">24h</th>
                                <th data-sort="change30d" class="${sortConfig.key === 'change30d' ? 'active ' + sortConfig.direction : ''}" style="padding-right: var(--spacing-md);">30d</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedData.map(asset => `
                                <tr>
                                    <td style="min-width: 100px; padding-left: var(--spacing-md);">
                                        <div class="asset-cell">
                                            ${asset.image
            ? `<img src="${asset.image}" alt="${asset.symbol}" style="width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;">`
            : `<div class="asset-icon-small" style="background: rgba(0, 212, 170, 0.1); color: var(--accent-primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                    ${getIcon(asset.icon || 'dollarSign')}
                                                </div>`
        }
                                            <div style="display: flex; flex-direction: column; min-width: 0;">
                                                <span class="asset-symbol" style="color: var(--text-primary); font-weight: 700; font-size: 13px;">${asset.symbol.toUpperCase()}</span>
                                                <span class="asset-name" style="font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px;">${asset.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="font-weight: 600; font-variant-numeric: tabular-nums;">${asset.price !== null ? formatCurrency(asset.price, symbol) : '-'}</td>
                                    <td class="${asset.change24h >= 0 ? 'text-positive' : 'text-negative'}" style="font-variant-numeric: tabular-nums;">${asset.change24h !== null ? formatPercentage(asset.change24h) : '-'}</td>
                                    <td class="${asset.change30d >= 0 ? 'text-positive' : 'text-negative'}" style="font-variant-numeric: tabular-nums; padding-right: var(--spacing-md);">${asset.change30d !== null ? formatPercentage(asset.change30d) : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

async function loadData() {
    const state = store.getState();
    const currency = state.currency || 'EUR';
    if (isLoading) return;

    isLoading = true;
    currentMarketCurrency = currency;

    marketData = await fetchMarketData(currency);
    store.saveMarketData(marketData);

    isLoading = false;
    window.dispatchEvent(new CustomEvent('market-ready'));
}

export function setupMarketPageListeners(onBack) {
    const backBtn = document.getElementById('market-back');
    if (backBtn) {
        backBtn.addEventListener('click', onBack);
    }

    const headers = document.querySelectorAll('.market-table th[data-sort]');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const key = header.dataset.sort;
            if (sortConfig.key === key) {
                sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
            } else {
                sortConfig.key = key;
                sortConfig.direction = 'desc';
                if (key === 'name') sortConfig.direction = 'asc';
            }
            if (typeof window.reRender === 'function') window.reRender();
        });
    });

    const toggles = document.querySelectorAll('.market-currency-toggle .btn-toggle');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const newCurr = btn.dataset.curr;
            store.setCurrency(newCurr);
            loadData(); // This will trigger re-render on market-ready
        });
    });

    window.addEventListener('market-ready', () => {
        if (typeof window.reRender === 'function') window.reRender();
    });
}
