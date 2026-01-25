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
                <h1 class="page-title">Connections</h1>
                <p class="page-subtitle">Gestiona tus relaciones y conexiones</p>
                
                <div class="social-header-actions" style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn btn-primary" id="add-person-btn">
                        ${getIcon('plus')} Lead
                    </button>
                    <button class="btn btn-primary" id="add-social-col-btn" style="filter: hue-rotate(45deg);">
                        ${getIcon('plus')} Etapa
                    </button>
                    <button class="btn btn-secondary" id="ideal-lead-btn">
                        ${getIcon('target')} Lead Ideal
                    </button>
                    <button class="btn btn-secondary" id="communications-mgr-btn">
                        ${getIcon('messageSquare')} Comunicaciones
                    </button>
                    <button class="btn btn-secondary" id="contact-sources-btn">
                        ${getIcon('users')} Fuentes
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
    const daysSince = person.lastContact ? Math.floor((Date.now() - new Date(person.lastContact).getTime()) / (1000 * 60 * 60 * 24)) : null;
    const color = person.color || '#3b82f6';

    return `
    <div class="person-card glass-panel" draggable="true" data-id="${person.id}">
        <div class="person-color-strip" style="background: ${color};"></div>
        <div class="person-card-content">
            <div class="person-header" style="margin-bottom: 2px;">
                <h3 class="person-name" style="font-size: 14px;">${person.name}</h3>
                ${person.rating ? `<span class="person-rating" style="font-size: 10px; font-weight: 800; color: var(--accent-tertiary);">★${person.rating}</span>` : ''}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="person-info-left" style="display: flex; align-items: center; gap: 8px;">
                    <div class="person-detail text-muted" style="font-size: 10px; font-weight: 600;">
                        ${daysSince !== null ? `${daysSince === 0 ? 'Hoy' : `Hace ${daysSince}d`}` : 'Contactar'}
                    </div>
                    ${person.source ? `<span class="tag" style="font-size: 8px; padding: 1px 4px; border-radius: 4px; background: rgba(255,255,255,0.05); color: var(--text-muted);">${person.source}</span>` : ''}
                </div>
                <button class="icon-btn person-chat-btn" data-id="${person.id}" style="padding: 4px; background: none; color: var(--accent-primary); opacity: 0.7;">
                    ${getIcon('messageSquare', 'tiny-icon')}
                </button>
            </div>
        </div>
    </div>
    `;
}

export function setupSocialPageListeners() {
    // Only attach global listeners once
    if (window.socialListenersAttached) return;
    window.socialListenersAttached = true;

    // Delegate all clicks
    document.addEventListener('click', (e) => {
        // Column Options
        const optBtn = e.target.closest('.col-opts-btn');
        if (optBtn) {
            e.preventDefault();
            e.stopPropagation();
            showColumnOptionsMenu(optBtn.dataset.id, optBtn);
            return;
        }

        // Add Stage
        if (e.target.closest('#add-social-col-btn')) {
            handleAddColumn();
            return;
        }

        // Add Person
        if (e.target.closest('#add-person-btn')) {
            window.dispatchEvent(new CustomEvent('open-add-modal', { detail: { type: 'person' } }));
            return;
        }

        // Ideal Lead
        if (e.target.closest('#ideal-lead-btn')) {
            handleIdealLead();
            return;
        }

        // Communications Manager
        if (e.target.closest('#communications-mgr-btn')) {
            import('../components/CommunicationsModal.js').then(m => m.openCommunicationsModal());
            return;
        }

        // Contact Sources Manager
        if (e.target.closest('#contact-sources-btn')) {
            handleContactSources();
            return;
        }

        // Person Chat Icon (Select communication)
        const chatBtn = e.target.closest('.person-chat-btn');
        if (chatBtn) {
            e.preventDefault();
            e.stopPropagation();
            import('../components/CommunicationsModal.js').then(m => m.openCommunicationsModal(chatBtn.dataset.id));
            return;
        }

        // Person Card
        const card = e.target.closest('.person-card');
        if (card) {
            openPersonDetails(card.dataset.id);
            return;
        }
    });

    // Drag & Drop Delegation
    document.addEventListener('dragstart', (e) => {
        const card = e.target.closest('.person-card');
        if (card) {
            e.dataTransfer.setData('text/plain', card.dataset.id);
            card.classList.add('dragging');
        }
    });

    document.addEventListener('dragend', (e) => {
        const card = e.target.closest('.person-card');
        if (card) card.classList.remove('dragging');
    });

    document.addEventListener('dragover', (e) => {
        const zone = e.target.closest('.kanban-cards');
        if (zone) {
            e.preventDefault();
            zone.classList.add('drag-over');
        }
    });

    document.addEventListener('dragleave', (e) => {
        const zone = e.target.closest('.kanban-cards');
        if (zone) zone.classList.remove('drag-over');
    });

    document.addEventListener('drop', (e) => {
        const zone = e.target.closest('.kanban-cards');
        if (zone) {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const personId = e.dataTransfer.getData('text/plain');
            const newColId = zone.dataset.colId;
            if (personId && newColId) {
                store.movePerson(personId, newColId);
            }
        }
    });
}

async function handleAddColumn() {
    const name = await ns.prompt('Etapa', 'Nombre de la etapa:');
    if (name) {
        store.addSocialColumn({ name, color: '#94a3b8' });
        ns.toast('Etapa agregada correctamente', 'success');
    }
}

async function handleIdealLead() {
    const currentProfile = store.getState().social.idealLeadProfile || '';
    const newProfile = await openIdealLeadModal(currentProfile);
    if (newProfile !== null) {
        store.updateIdealLeadProfile(newProfile);
        ns.toast('Perfil Ideal actualizado');
    }
}

function openPersonDetails(personId) {
    const person = store.getState().social.people.find(p => p.id === personId);
    if (!person) return;
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
        const close = () => { overlay.remove(); resolve(null); };
        overlay.querySelector('.modal-close').addEventListener('click', close);
        overlay.querySelector('#save-ideal-lead').addEventListener('click', () => {
            const val = overlay.querySelector('#ideal-lead-text').value;
            overlay.remove();
            resolve(val);
        });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    });
}

function showColumnOptionsMenu(colId, triggerBtn) {
    document.querySelectorAll('.column-options-menu').forEach(m => m.remove());
    const col = store.getState().social.columns.find(c => c.id === colId);
    if (!col) return;

    const menu = document.createElement('div');
    menu.className = 'column-options-menu';
    menu.innerHTML = `
        <button class="menu-item" data-action="edit">${getIcon('edit')} Editar Nombre</button>
        <button class="menu-item" data-action="color">${getIcon('palette')} Cambiar Color</button>
        <div class="menu-divider"></div>
        <button class="menu-item" data-action="move_up">${getIcon('chevronUp')} Mover Arriba (Anterior)</button>
        <button class="menu-item" data-action="move_down">${getIcon('chevronDown')} Mover Abajo (Siguiente)</button>
        <div class="menu-divider"></div>
        <button class="menu-item menu-item-danger" data-action="delete">${getIcon('trash')} Eliminar Etapa</button>
    `;

    const rect = triggerBtn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + 8}px`;
    menu.style.right = `${window.innerWidth - rect.right}px`;
    menu.style.zIndex = '9999';
    document.body.appendChild(menu);

    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', async () => {
            const action = item.dataset.action;
            menu.remove();
            if (action === 'edit') {
                const newName = await ns.prompt('Nombre de Columna', 'Nuevo nombre:', col.name);
                if (newName?.trim()) store.updateSocialColumn(colId, { name: newName.trim() });
            } else if (action === 'color') {
                const newColor = await openColorPickerModal(col.color);
                if (newColor) store.updateSocialColumn(colId, { color: newColor });
            } else if (action === 'delete') {
                if (await ns.confirm('Eliminar Etapa', `¿Eliminar "${col.name}"?`)) store.deleteSocialColumn(colId);
            } else if (action === 'move_up' || action === 'move_down') {
                const columns = [...store.getState().social.columns].sort((a, b) => a.order - b.order);
                const idx = columns.findIndex(c => c.id === colId);
                if (idx === -1) return;
                const targetIdx = action === 'move_up' ? idx - 1 : idx + 1;
                if (targetIdx >= 0 && targetIdx < columns.length) {
                    [columns[idx].order, columns[targetIdx].order] = [columns[targetIdx].order, columns[idx].order];
                    store.reorderSocialColumns(columns);
                }
            }
        });
    });

    const closeMenu = (e) => {
        if (!menu.contains(e.target) && e.target !== triggerBtn) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 10);
}

function openColorPickerModal(currentColor) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.style.zIndex = '99999';
        overlay.innerHTML = `
            <div class="modal" style="max-width: 320px;">
                <div class="modal-header">
                    <h2 class="modal-title">Color de Etapa</h2>
                    <button class="modal-close">${getIcon('x')}</button>
                </div>
                <div style="padding: 20px 0;">
                    <input type="color" id="stage-color-input" class="color-picker-input" value="${currentColor || '#3b82f6'}">
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 16px;">
                        ${['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#64748b', '#000000']
                .map(c => `<div class="color-swatch" data-color="${c}" style="background:${c}; height:30px; border-radius:6px; cursor:pointer; border:2px solid ${currentColor === c ? 'white' : 'transparent'}"></div>`).join('')}
                    </div>
                    <button class="btn btn-primary w-full" id="save-stage-color" style="margin-top: 24px;">Aplicar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        const close = () => { overlay.remove(); resolve(null); };
        overlay.querySelector('.modal-close').addEventListener('click', close);
        overlay.querySelectorAll('.color-swatch').forEach(s => s.addEventListener('click', () => {
            overlay.querySelector('#stage-color-input').value = s.dataset.color;
            overlay.querySelectorAll('.color-swatch').forEach(sw => sw.style.borderColor = 'transparent');
            s.style.borderColor = 'white';
        }));
        overlay.querySelector('#save-stage-color').addEventListener('click', () => {
            const val = overlay.querySelector('#stage-color-input').value;
            overlay.remove();
            resolve(val);
        });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    });
}

async function handleContactSources() {
    const { contactSources } = store.getState().social;
    const result = await openContactSourcesModal(contactSources);
    if (result) {
        store.updateContactSources(result);
        ns.toast('Fuentes de contacto actualizadas');
    }
}

function openContactSourcesModal(currentSources) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.style.zIndex = '9999';
        overlay.innerHTML = `
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h2 class="modal-title">Fuentes de Contacto</h2>
                    <button class="modal-close">${getIcon('x')}</button>
                </div>
                <div style="padding: 20px 0;">
                    <p style="margin-bottom: 15px; font-size: 13px; color: var(--text-secondary);">Escribe las fuentes separadas por coma:</p>
                    <textarea id="contact-sources-text" class="form-input" rows="4" placeholder="Ej: Instagram, WhatsApp, Amigo...">${currentSources.join(', ')}</textarea>
                    <button class="btn btn-primary w-full" id="save-contact-sources" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        const close = () => { overlay.remove(); resolve(null); };
        overlay.querySelector('.modal-close').addEventListener('click', close);
        overlay.querySelector('#save-contact-sources').addEventListener('click', () => {
            const val = overlay.querySelector('#contact-sources-text').value;
            const sources = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
            overlay.remove();
            resolve(sources);
        });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    });
}
