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
import { renderExpensesPage, setupExpensesPageListeners } from './pages/ExpensesPage.js';
import { openAddModal } from './components/AddModal.js';
import { getIcon } from './utils/icons.js';
import { DriveService } from './services/DriveService.js';

import { renderAuthShield, setupAuthListeners } from './components/AuthShield.js';
import { AuthService } from './services/AuthService.js';

// Current page state
let currentPage = localStorage.getItem('life-dashboard/app_current_page') || 'finance';
let currentSubPage = localStorage.getItem('life-dashboard/app_current_sub_page') || null; // For sub-navigation like compound calculator or markets
if (currentSubPage === 'null') currentSubPage = null;

// Initialize app
async function init() {
    // Proactive Drive init
    DriveService.init().catch(e => console.warn('[Drive] Pre-init failed:', e));

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

    // Setup PWA install banner
    setupPWAInstallBanner();
}

// Create and manage PWA install banner
function setupPWAInstallBanner() {
    // Check if banner was dismissed recently (don't show for 7 days after dismiss)
    const dismissedAt = localStorage.getItem('life-dashboard/pwa_install_dismissed');
    if (dismissedAt) {
        const daysSinceDismiss = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismiss < 7) return;
    }

    // Check if already installed (in standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return;
    }

    // Create banner element
    const banner = document.createElement('div');
    banner.className = 'pwa-install-banner';
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
        <div class="pwa-install-banner-icon">
            ${getIcon('download')}
        </div>
        <div class="pwa-install-banner-text">
            <div class="pwa-install-banner-title">Instalar Life Dashboard</div>
            <div class="pwa-install-banner-subtitle">Accede más rápido desde tu pantalla de inicio</div>
        </div>
        <button class="pwa-install-btn" id="pwa-banner-install">Instalar</button>
        <button class="pwa-install-close" id="pwa-banner-close">
            ${getIcon('x')}
        </button>
    `;
    document.body.appendChild(banner);

    // Show banner when install prompt is available
    const showBannerIfReady = () => {
        if (window.deferredPrompt) {
            setTimeout(() => {
                banner.classList.add('visible');
            }, 2000); // Show after 2 seconds for better UX
        }
    };

    // Check if prompt already available
    showBannerIfReady();

    // Also listen for future prompts
    window.addEventListener('beforeinstallprompt', showBannerIfReady);

    // Handle install button click
    document.getElementById('pwa-banner-install')?.addEventListener('click', async () => {
        if (!window.deferredPrompt) return;

        window.deferredPrompt.prompt();
        const { outcome } = await window.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 500);
        }

        window.deferredPrompt = null;
    });

    // Handle close button
    document.getElementById('pwa-banner-close')?.addEventListener('click', () => {
        banner.classList.remove('visible');
        localStorage.setItem('life-dashboard/pwa_install_dismissed', Date.now().toString());
        setTimeout(() => banner.remove(), 500);
    });
}

// Render the entire app shell
function renderApp() {
    const nav = document.getElementById('bottom-nav');
    nav.innerHTML = renderBottomNav(currentPage);

    setupNavListeners((pageId) => {
        currentPage = pageId;
        currentSubPage = null;
        localStorage.setItem('life-dashboard/app_current_page', currentPage);
        localStorage.setItem('life-dashboard/app_current_sub_page', currentSubPage);
        showFAB();
        renderPage();

        // Update nav active state
        nav.innerHTML = renderBottomNav(currentPage);
        setupNavListeners((p) => {
            currentPage = p;
            currentSubPage = null;
            localStorage.setItem('life-dashboard/app_current_page', currentPage);
            localStorage.setItem('life-dashboard/app_current_sub_page', currentSubPage);
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

    if (currentSubPage === 'expenses') {
        main.innerHTML = renderExpensesPage();
        setupExpensesPageListeners(() => {
            currentSubPage = null;
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
            showFAB();
            main.innerHTML = renderFinancePage();
            setupFinancePageListeners();
            setupSubPageButtons();
            break;
        case 'goals':
            showFAB();
            main.innerHTML = renderGoalsPage();
            setupGoalsPageListeners();
            break;
        case 'calendar':
            showFAB();
            main.innerHTML = renderCalendarPage();
            setupCalendarPageListeners();
            break;
        case 'health':
            main.innerHTML = renderHealthPage();
            setupHealthPageListeners();
            hideFAB();
            break;
        case 'settings':
            main.innerHTML = renderSettingsPage();
            setupSettingsListeners();
            hideFAB();
            break;
        default:
            showFAB();
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
            localStorage.setItem('life-dashboard/app_current_sub_page', currentSubPage);
            hideFAB();
            renderPage();
        });
    }

    const marketsBtn = document.getElementById('open-markets');
    if (marketsBtn) {
        marketsBtn.addEventListener('click', () => {
            currentSubPage = 'market';
            localStorage.setItem('life-dashboard/app_current_sub_page', currentSubPage);
            hideFAB();
            renderPage();
        });
    }

    const expensesBtn = document.getElementById('open-expenses');
    if (expensesBtn) {
        expensesBtn.addEventListener('click', () => {
            currentSubPage = 'expenses';
            localStorage.setItem('life-dashboard/app_current_sub_page', currentSubPage);
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

    fab.addEventListener('click', async () => {
        if (currentPage === 'calendar') {
            openAddModal('event');
        } else if (currentPage === 'health') {
            // Simplified prompt for health metrics
            const options = await ns.confirm('Registrar Métrica', '¿Qué deseas registrar hoy?', 'Peso', 'Grasa');
            if (options === true) {
                const weight = await ns.prompt('Registrar Peso', 'Ingresa tu peso actual en kg:', '', 'number');
                if (weight) store.addWeightLog(weight);
            } else if (options === false) {
                const fat = await ns.prompt('Grasa Corporal', 'Ingresa tu % de grasa:', '', 'number');
                if (fat) store.addFatLog(fat);
            }
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

// Capture PWA install prompt for later use
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    console.log('PWA Install Prompt ready');

    // If we're on the settings page, show the install button
    const installCard = document.getElementById('install-pwa-card');
    if (installCard) {
        installCard.style.display = 'block';
    }
});
