import { fetchMarketData, ASSET_CATEGORIES } from '../../services/MarketService.js';
import { store } from '../../store.js';
import { formatCurrency, formatPercentage } from '../../utils/format.js';
import { getIcon } from '../../utils/icons.js';
import { ns } from '../../utils/notifications.js';

let isFresh = false;
let isLoading = false;
let sortConfig = { key: 'price', direction: 'desc' };
let currentViewCurrency = 'USD';
let showMode = null;

export function renderMarketView() {
    const state = store.getState();
    const marketData = state.lastMarketData || [];
    const favorites = state.marketFavorites || [];

    if (showMode === null) {
        showMode = favorites.length > 0 ? 'favorites' : 'all';
    }

    if (!isLoading && !isFresh) {
        updateMarketData();
    }

    const symbol = currentViewCurrency === 'EUR' ? '€' : '$';

    let displayData = marketData;
    if (showMode === 'favorites') {
        displayData = marketData.filter(a => favorites.includes(a.id));
    }

    const categories = Object.values(ASSET_CATEGORIES);

    return `
        <div class="market-view animate-fade-in" style="padding: 4px;">
            <!-- Single Line Header Controls -->
            <div class="market-controls-row">
                <div class="market-group">
                    <button class="filter-chip ${showMode === 'all' ? 'active' : ''}" id="filter-all">
                        Todos
                    </button>
                    <button class="filter-chip ${showMode === 'favorites' ? 'active' : ''}" id="filter-favs">
                        ${getIcon('star', 'tiny-icon')} Favoritos
                    </button>
                </div>

                <div class="market-status-badge ${isFresh ? 'market-status-fresh' : 'market-status-cached'}" title="Tasa de refresco: 5 min">
                    ${isLoading ? '<div class="loading-spinner-sm" style="width:10px; height:10px;"></div>' : (isFresh ? getIcon('check', 'tiny-icon') : getIcon('save', 'tiny-icon'))}
                    <span>${isLoading ? 'Updating' : (isFresh ? 'Live' : 'Cached')}</span>
                </div>

                <div class="capsule-toggle">
                    <button class="capsule-btn ${currentViewCurrency === 'USD' ? 'active' : ''}" data-curr="USD">USD</button>
                    <button class="capsule-btn ${currentViewCurrency === 'EUR' ? 'active' : ''}" data-curr="EUR">EUR</button>
                </div>
            </div>

            <!-- Content -->
            ${displayData.length === 0 && showMode === 'favorites' ? renderEmptyFavorites() : ''}
            ${displayData.length === 0 && showMode === 'all' ? renderEmptyState() : ''}
            
            ${categories.map(cat => {
        const catData = displayData.filter(a => a.category === cat);
        if (catData.length === 0) return '';
        return renderCategoryTable(cat, catData, symbol, favorites);
    }).join('')}
        </div>
    `;
}

function renderCategoryTable(categoryName, data, symbol, favorites) {
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
        <div class="market-section" style="margin-top: var(--spacing-lg);">
            <header style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                <h3 style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
                    ${categoryName}
                </h3>
                <span style="font-size: 10px; color: var(--text-muted); opacity: 0.5;">${data.length} activos</span>
            </header>
            <div class="card market-table-card" style="padding: 0 !important; overflow: hidden; background: rgba(10, 15, 30, 0.4); border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <div class="table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th style="width: 44px;"></th>
                                <th data-sort="name" class="sortable ${sortConfig.key === 'name' ? sortConfig.direction : ''}">Nombre</th>
                                <th data-sort="price" class="sortable text-right ${sortConfig.key === 'price' ? sortConfig.direction : ''}">Precio</th>
                                <th data-sort="change24h" class="sortable text-right ${sortConfig.key === 'change24h' ? sortConfig.direction : ''}">24h</th>
                                <th data-sort="change30d" class="sortable text-right ${sortConfig.key === 'change30d' ? sortConfig.direction : ''}">30d</th>
                                <th data-sort="change1y" class="sortable text-right ${sortConfig.key === 'change1y' ? sortConfig.direction : ''}">1y</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedData.map(asset => renderAssetRow(asset, symbol, favorites.includes(asset.id))).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderAssetRow(asset, symbol, isFav) {
    let convertedPrice = asset.price;
    if (asset.price !== null) {
        if (currentViewCurrency === 'EUR') {
            const rateUSD = store.getState().rates.USD || 0.92;
            convertedPrice = asset.price * rateUSD;
        }
    }

    const color24h = getChangeColorClass(asset.change24h);
    const color30d = getChangeColorClass(asset.change30d);
    const color1y = getChangeColorClass(asset.change1y);

    return `
        <tr class="market-row" data-id="${asset.id}">
            <td style="padding: 0 0 0 12px; width: 44px;">
                <button class="btn-favorite ${isFav ? 'active' : ''}" data-id="${asset.id}">
                    ${getIcon('star')}
                </button>
            </td>
            <td>
                <div class="asset-cell">
                     ${asset.image
            ? `<img src="${asset.image}" alt="${asset.symbol}" style="width: 22px; height: 22px; border-radius: 50%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">`
            : `<div class="asset-icon-tiny" style="background: rgba(255,255,255,0.05); color: var(--text-muted); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${getIcon(asset.icon || 'trendingUp')}</div>`
        }
                    <div style="display: flex; flex-direction: column; gap: 1px;">
                        <span class="asset-symbol" style="line-height: 1.2;">${asset.symbol.toUpperCase()}</span>
                        <span class="asset-name-tiny">${asset.name}</span>
                    </div>
                </div>
            </td>
            <td class="text-right font-mono" style="font-weight: 700; color: var(--text-primary);">${convertedPrice !== null ? formatCurrency(convertedPrice, symbol) : '-'}</td>
            <td class="text-right font-mono ${color24h}" style="font-weight: 700;">
                ${asset.change24h !== null ? formatPercentage(asset.change24h) : '-'}
            </td>
            <td class="text-right font-mono ${color30d}" style="font-size: 11px; opacity: 0.9;">
                ${asset.change30d !== null ? formatPercentage(asset.change30d) : '-'}
            </td>
            <td class="text-right font-mono ${color1y}" style="font-size: 11px; opacity: 0.9;">
                ${asset.change1y !== null ? formatPercentage(asset.change1y) : '-'}
            </td>
        </tr>
    `;
}

function getChangeColorClass(val) {
    if (val === null || val === undefined) return '';
    if (!isFresh) return 'text-accent-primary';
    return val >= 0 ? 'text-positive' : 'text-negative';
}

function renderEmptyFavorites() {
    return `
        <div class="empty-state" style="padding: 60px 20px; text-align: center; background: rgba(255,255,255,0.02); border-radius: var(--radius-lg); border: 1px dashed rgba(255,255,255,0.1); margin-top: 20px;">
            <div style="font-size: 32px; margin-bottom: 12px; filter: grayscale(1);">⭐</div>
            <h3 style="color: var(--text-primary); margin-bottom: 8px;">No hay favoritos todavía</h3>
            <p style="color: var(--text-muted); font-size: 14px; max-width: 250px; margin: 0 auto;">Marca con una estrella los activos que quieres seguir de cerca.</p>
            <button class="btn btn-secondary" id="btn-show-all" style="margin-top: 24px; font-size: 12px; padding: 10px 20px; border-radius: 30px;">Ver todos los activos</button>
        </div>
    `;
}

function renderEmptyState() {
    return `
        <div class="empty-state" style="padding: 100px 0;">
             <div class="loading-spinner"></div>
             <p style="margin-top: 20px; color: var(--text-muted); font-size: 14px; letter-spacing: 0.5px;">CONSULTANDO MERCADOS GLOBALES...</p>
        </div>
    `;
}

async function updateMarketData() {
    if (isLoading) return;
    isLoading = true;
    window.reRender?.();

    try {
        const data = await fetchMarketData();
        store.saveMarketData(data);
        isFresh = true;
    } catch (e) {
        console.error('Market update failed', e);
    } finally {
        isLoading = false;
        window.reRender?.();
    }
}

export function setupMarketViewListeners() {
    document.querySelectorAll('.capsule-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const curr = btn.dataset.curr;
            if (curr !== currentViewCurrency) {
                currentViewCurrency = curr;
                window.reRender?.();
            }
        });
    });

    document.getElementById('filter-all')?.addEventListener('click', () => {
        showMode = 'all';
        window.reRender?.();
    });

    document.getElementById('filter-favs')?.addEventListener('click', () => {
        showMode = 'favorites';
        window.reRender?.();
    });

    document.getElementById('btn-show-all')?.addEventListener('click', () => {
        showMode = 'all';
        window.reRender?.();
    });

    document.querySelectorAll('.btn-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            store.toggleMarketFavorite(id);
            window.reRender?.();
        });
    });

    document.querySelectorAll('.market-table th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const key = th.dataset.sort;
            if (sortConfig.key === key) {
                sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
            } else {
                sortConfig.key = key;
                sortConfig.direction = 'desc';
                if (key === 'name') sortConfig.direction = 'asc';
            }
            window.reRender?.();
        });
    });
}
