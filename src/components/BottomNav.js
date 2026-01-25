/**
 * Bottom Navigation Component
 */

import { getIcon } from '../utils/icons.js';

const NAV_ITEMS = [
    { id: 'finance', icon: 'wallet', label: 'Finance' },
    { id: 'health', icon: 'heart', label: 'Health' },
    { id: 'goals', icon: 'target', label: 'Goals' },
    { id: 'social', icon: 'users', label: 'Connections' },
    { id: 'menu', icon: 'menu', label: 'Menu' }
];

export function renderBottomNav(activeId = 'finance') {
    const brand = `
        <div class="nav-brand">
            <div class="nav-brand-logo">
                <img src="icons/icon-192.png" alt="Logo" class="brand-logo-img">
            </div>
            <span class="nav-brand-text">LifeDashboard</span>
        </div>
    `;

    const items = NAV_ITEMS.map(item => `
        <div class="nav-item ${item.id === activeId ? 'active' : ''}" data-nav="${item.id}">
            ${getIcon(item.icon, 'nav-icon')}
            <span class="nav-label">${item.label}</span>
        </div>
    `).join('');

    return brand + items;
}

export function setupNavListeners(onNavigate) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const navId = item.dataset.nav;

            // Update active state
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Callback
            if (onNavigate) {
                onNavigate(navId);
            }
        });
    });
}
