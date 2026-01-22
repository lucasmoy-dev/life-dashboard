/**
 * Life Dashboard - Main Application Entry
 */

import { store } from './store.js';
import { renderBottomNav, setupNavListeners } from './components/BottomNav.js';
import { renderFinancePage, setupFinancePageListeners } from './pages/FinancePage.js';
import { renderCompoundPage, setupCompoundPageListeners, resetCompoundPage } from './pages/CompoundPage.js';
import { renderMarketPage, setupMarketPageListeners } from './pages/MarketPage.js';
import { renderHealthPage, setupHealthPageListeners } from './pages/HealthPage.js';
import { renderGoalsPage, setupGoalsPageListeners } from './pages/GoalsPage.js';
import { renderCalendarPage, setupCalendarPageListeners } from './pages/CalendarPage.js';
import { openAddModal } from './components/AddModal.js';
import { getIcon } from './utils/icons.js';

import { renderAuthShield, setupAuthListeners } from './components/AuthShield.js';
import { AuthService } from './services/AuthService.js';

// Current page state
let currentPage = 'finance';
let currentSubPage = null; // For sub-navigation like compound calculator or markets

// Initialize app
async function init() {
    // Check if we have an active vault key
    const vaultKey = AuthService.getVaultKey();

    if (vaultKey) {
        // Load and decrypt stored state if it exists
        await store.loadEncrypted(vaultKey);
        startDashboard();
    } else {
        renderAuth();
    }
}

function renderAuth() {
    const app = document.getElementById('app');
    app.innerHTML = renderAuthShield();
    setupAuthListeners(() => {
        startDashboard();
    });
}

function startDashboard() {
    // Restore the app shell structure if it was overwritten by AuthShield
    const app = document.getElementById('app');
    app.innerHTML = `
        <main id="main-content"></main>
        <nav id="bottom-nav"></nav>
    `;

    renderApp();

    // Subscribe to store changes
    store.subscribe(() => {
        // Re-render current page on store changes
        renderPage();
    });

    // Handle global re-render requests (e.g. from async loaders)
    window.reRender = () => renderPage();
}

// Render the entire app shell
function renderApp() {
    const nav = document.getElementById('bottom-nav');
    nav.innerHTML = renderBottomNav(currentPage);

    setupNavListeners((pageId) => {
        currentPage = pageId;
        currentSubPage = null;
        showFAB();
        renderPage();

        // Update nav active state
        nav.innerHTML = renderBottomNav(currentPage);
        setupNavListeners((p) => {
            currentPage = p;
            currentSubPage = null;
            showFAB();
            renderPage();
            renderApp(); // Refresh nav
        });
    });

    // Add FAB
    addFAB();

    // Render current page
    renderPage();
}

import { renderSettingsPage, setupSettingsListeners } from './pages/SettingsPage.js';

// Render current page content
function renderPage() {
    const main = document.getElementById('main-content');

    // Handle sub-pages first
    if (currentSubPage === 'compound') {
        main.innerHTML = renderCompoundPage();
        setupCompoundPageListeners(() => {
            currentSubPage = null;
            resetCompoundPage();
            showFAB();
            renderPage();
        });
        return;
    }

    if (currentSubPage === 'market') {
        main.innerHTML = renderMarketPage();
        setupMarketPageListeners(() => {
            currentSubPage = null;
            showFAB();
            renderPage();
        });
        return;
    }

    switch (currentPage) {
        case 'finance':
            main.innerHTML = renderFinancePage();
            setupFinancePageListeners();
            setupSubPageButtons();
            break;
        case 'goals':
            main.innerHTML = renderGoalsPage();
            setupGoalsPageListeners();
            break;
        case 'calendar':
            main.innerHTML = renderCalendarPage();
            setupCalendarPageListeners();
            break;
        case 'health':
            main.innerHTML = renderHealthPage();
            setupHealthPageListeners();
            break;
        case 'settings':
            main.innerHTML = renderSettingsPage();
            setupSettingsListeners();
            break;
        default:
            main.innerHTML = renderFinancePage();
            setupFinancePageListeners();
            setupSubPageButtons();
    }
}

// Setup buttons that open sub-pages (Markets, Compound)
function setupSubPageButtons() {
    const compoundBtn = document.getElementById('open-compound');
    if (compoundBtn) {
        compoundBtn.addEventListener('click', () => {
            currentSubPage = 'compound';
            hideFAB();
            renderPage();
        });
    }

    const marketsBtn = document.getElementById('open-markets');
    if (marketsBtn) {
        marketsBtn.addEventListener('click', () => {
            currentSubPage = 'market';
            hideFAB();
            renderPage();
        });
    }
}

// Add floating action button
function addFAB() {
    // Remove existing FAB if any
    const existingFab = document.querySelector('.fab');
    if (existingFab) existingFab.remove();

    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.id = 'main-fab';
    fab.innerHTML = getIcon('plus', 'fab-icon');
    fab.setAttribute('aria-label', 'Agregar');

    fab.addEventListener('click', () => {
        if (currentPage === 'calendar') {
            openAddModal('event');
        } else {
            openAddModal();
        }
    });

    document.body.appendChild(fab);
}

function hideFAB() {
    const fab = document.getElementById('main-fab');
    if (fab) fab.style.display = 'none';
}

function showFAB() {
    const fab = document.getElementById('main-fab');
    if (fab) fab.style.display = 'flex';
}

// Placeholder for coming soon pages
function renderComingSoon(title, icon, description) {
    return `
    <div class="stagger-children" style="min-height: 60vh; display: flex; flex-direction: column; justify-content: center;">
      <header class="page-header">
        <h1 class="page-title">${title}</h1>
      </header>
      <div class="empty-state">
        ${getIcon(icon, 'empty-icon')}
        <div class="empty-title">Próximamente</div>
        <p class="empty-description">${description}</p>
      </div>
    </div>
  `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            console.log('Service Worker not available');
        });
    });
}
