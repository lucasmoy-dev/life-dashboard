import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

export function renderSocialPage() {
    const { social } = store.getState();
    const { people, columns } = social;

    return `
    <div class="social-page stagger-children">
        <header class="page-header" style="margin-bottom: var(--spacing-sm);">
            <div class="header-content">
                <h1 class="page-title">Social CRM</h1>
                <p class="page-subtitle">Gestiona tus relaciones y conexiones</p>
                
                <div class="social-header-actions" style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn-action-primary" id="add-person-btn">
                        ${getIcon('users')} Nuevo Lead
                    </button>
                    <button class="btn-action-secondary" id="add-social-col-btn">
                        ${getIcon('plus')} Etapa
                    </button>
                    <button class="btn-action-outline" id="ideal-lead-btn">
                        ${getIcon('target')} Lead Ideal
                    </button>
                </div>
            </div>
        </header>

        <div class="kanban-container">
            ${columns.sort((a, b) => a.order - b.order).map(col => {
        const colPeople = people.filter(p => p.columnId === col.id);
        return `
                <div class="kanban-column" data-col-id="${col.id}">
                    <div class="kanban-column-header">
                        <div class="kanban-col-title">
                            <span class="kanban-dot" style="background: ${col.color}"></span>
                            ${col.name}
                            <span class="kanban-count">${colPeople.length}</span>
                        </div>
                        <button class="icon-btn col-opts-btn" data-id="${col.id}">${getIcon('moreVertical')}</button>
                    </div>
                    <div class="kanban-cards" data-col-id="${col.id}">
                        ${colPeople.map(person => renderPersonCard(person)).join('')}
                    </div>
                </div>
                `;
    }).join('')}
        </div>
    </div>
    `;
}

function renderPersonCard(person) {
    return `
    <div class="person-card glass-panel" draggable="true" data-id="${person.id}">
        <div class="person-header">
            <h3 class="person-name">${person.name}</h3>
            ${person.rating ? `<span class="person-rating">★ ${person.rating}</span>` : ''}
        </div>
        ${person.city ? `<div class="person-detail text-muted">${getIcon('map', 'tiny-icon')} ${person.city}</div>` : ''}
        <div class="person-tags">
            ${person.source ? `<span class="tag">${person.source}</span>` : ''}
        </div>
    </div>
    `;
}

export function setupSocialPageListeners() {
    const container = document.querySelector('.kanban-container');

    // Column Options - Event Delegation
    // Listen on document to catch it even if rendered later or dynamically
    document.addEventListener('click', (e) => {
        // Find if clicked element is or is inside .col-opts-btn
        const btn = e.target.closest('.col-opts-btn');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            const colId = btn.dataset.id;
            console.log('Opening menu for column:', colId);
            showColumnOptionsMenu(colId, btn);
        }
    });

    // Add Column
    document.getElementById('add-social-col-btn')?.addEventListener('click', async () => {
        const name = await ns.prompt('Nueva Columna', 'Nombre de la etapa:');
        if (name) {
            store.addSocialColumn({ name, color: '#94a3b8' });
        }
    });

    // Add Person Button
    document.getElementById('add-person-btn')?.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-add-modal', { detail: { type: 'person' } }));
    });

    // Ideal Lead Button
    document.getElementById('ideal-lead-btn')?.addEventListener('click', async () => {
        const currentProfile = store.getState().social.idealLeadProfile || '';
        const newProfile = await openIdealLeadModal(currentProfile);
        if (newProfile !== null) {
            store.updateIdealLeadProfile(newProfile);
            ns.toast('Perfil Ideal actualizado');
        }
    });

    // Person Interactions (Click & Drag)
    // Re-attaching these is fine as they are specific to the elements
    // But for robustness, we can use delegation for click at least.

    // Using delegation for person click
    if (container) {
        container.addEventListener('click', (e) => {
            const card = e.target.closest('.person-card');
            if (card) {
                // Check if we didn't click a button inside (unlikely but good practice)
                openPersonDetails(card.dataset.id);
            }
        });

        // For Drag and Drop, we still need direct listeners often, 
        // but let's try to set them up on the container if possible? 
        // No, standard API requires draggable elements to have listeners.
        // So we keep the loop for Drag/Drop setup.

        const attachDragListeners = () => {
            document.querySelectorAll('.person-card').forEach(card => {
                // Avoid double binding if possible, but setupSocialPageListeners is called on full re-render
                card.draggable = true;

                card.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', card.dataset.id);
                    card.classList.add('dragging');
                });

                card.addEventListener('dragend', () => {
                    card.classList.remove('dragging');
                });
            });

            document.querySelectorAll('.kanban-cards').forEach(zone => {
                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    zone.classList.add('drag-over');
                });

                zone.addEventListener('dragleave', () => {
                    zone.classList.remove('drag-over');
                });

                zone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zone.classList.remove('drag-over');
                    const personId = e.dataTransfer.getData('text/plain');
                    const newColId = zone.dataset.colId;
                    if (personId && newColId) {
                        store.movePerson(personId, newColId);
                    }
                });
            });
        };

        attachDragListeners();
    }
}

function openPersonDetails(personId) {
    const person = store.getState().social.people.find(p => p.id === personId);
    if (!person) return;

    // Dispatch event to open edit modal
    window.dispatchEvent(new CustomEvent('open-add-modal', { detail: { type: 'person', person } }));
}
function openIdealLeadModal(currentText) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.style.zIndex = '9999';
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">Lead Ideal (ICP)</h2>
                    <button class="modal-close">${getIcon('x')}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 10px; font-size: 13px; color: var(--text-secondary);">Define las características de tu cliente ideal.</p>
                    <textarea id="ideal-lead-text" class="form-input" rows="10" placeholder="Ej: Edad 25-35, Intereses en tecnología...">${currentText || ''}</textarea>
                    <button class="btn btn-primary w-full" id="save-ideal-lead" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const close = () => {
            overlay.remove();
            resolve(null);
        };

        overlay.querySelector('.modal-close').addEventListener('click', close);
        overlay.querySelector('#save-ideal-lead').addEventListener('click', () => {
            const val = overlay.querySelector('#ideal-lead-text').value;
            overlay.remove();
            resolve(val);
        });

        // Close on background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    });
}

// Custom dropdown menu for column options
function showColumnOptionsMenu(colId, triggerBtn) {
    // Remove any existing menu
    document.querySelectorAll('.column-options-menu').forEach(m => m.remove());

    const col = store.getState().social.columns.find(c => c.id === colId);
    if (!col) return;

    const menu = document.createElement('div');
    menu.className = 'column-options-menu';
    menu.innerHTML = `
        <button class="menu-item" data-action="edit">
            ${getIcon('edit')} Editar Nombre
        </button>
        <button class="menu-item" data-action="color">
            ${getIcon('palette')} Cambiar Color
        </button>
        <div class="menu-divider"></div>
        <button class="menu-item" data-action="move_left">
            ${getIcon('chevronLeft')} Mover Izquierda
        </button>
        <button class="menu-item" data-action="move_right">
            ${getIcon('chevronRight')} Mover Derecha
        </button>
        <div class="menu-divider"></div>
        <button class="menu-item menu-item-danger" data-action="delete">
            ${getIcon('trash')} Eliminar Etapa
        </button>
    `;

    // Position the menu near the button
    const rect = triggerBtn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + 8}px`;
    menu.style.right = `${window.innerWidth - rect.right}px`;
    menu.style.zIndex = '9999';

    document.body.appendChild(menu);

    // Handle menu actions
    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', async () => {
            const action = item.dataset.action;
            menu.remove();

            if (action === 'edit') {
                const newName = await ns.prompt('Nombre de Columna', 'Ingresa el nuevo nombre:', col.name);
                if (newName && newName.trim()) {
                    store.updateSocialColumn(colId, { name: newName.trim() });
                }
            } else if (action === 'color') {
                const newColor = await ns.prompt('Color de Etapa', 'Ingresa un color en formato hex (#rrggbb):', col.color);
                if (newColor && newColor.startsWith('#')) {
                    store.updateSocialColumn(colId, { color: newColor });
                }
            } else if (action === 'delete') {
                const confirmed = await ns.confirm('Eliminar Etapa', `¿Eliminar "${col.name}"? Los leads en esta etapa también se eliminarán.`);
                if (confirmed) {
                    store.deleteSocialColumn(colId);
                }
            } else if (action === 'move_left' || action === 'move_right') {
                const columns = [...store.getState().social.columns].sort((a, b) => a.order - b.order);
                const idx = columns.findIndex(c => c.id === colId);
                if (idx === -1) return;

                if (action === 'move_left' && idx > 0) {
                    const temp = columns[idx].order;
                    columns[idx].order = columns[idx - 1].order;
                    columns[idx - 1].order = temp;
                    store.reorderSocialColumns(columns);
                } else if (action === 'move_right' && idx < columns.length - 1) {
                    const temp = columns[idx].order;
                    columns[idx].order = columns[idx + 1].order;
                    columns[idx + 1].order = temp;
                    store.reorderSocialColumns(columns);
                }
            }
        });
    });

    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!menu.contains(e.target) && e.target !== triggerBtn) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 10);
}
