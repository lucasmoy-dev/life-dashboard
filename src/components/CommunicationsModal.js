/**
 * Communications Modal - Manage and select communication snippets
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

export function openCommunicationsModal(personId = null) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'communications-modal';
    overlay.style.zIndex = '10000';

    const person = personId ? store.getState().social.people.find(p => p.id === personId) : null;

    renderModal(overlay, person);
    document.body.appendChild(overlay);

    setupListeners(overlay, person);
}

function renderModal(overlay, person = null) {
    const { communications } = store.getState().social;
    const sortedComms = [...communications].sort((a, b) => a.order - b.order);

    overlay.innerHTML = `
        <div class="modal" style="max-width: 500px; height: 80dvh;">
            <div class="modal-header">
                <div>
                    <h2 class="modal-title">${person ? `Chat con ${person.name}` : 'Comunicaciones'}</h2>
                    ${person ? `<p class="modal-subtitle" style="font-size: 11px;">Selecciona un mensaje para copiar e indicar uso.</p>` : ''}
                </div>
                <button class="modal-close">${getIcon('x')}</button>
            </div>
            
            <div class="modal-body" style="flex: 1; overflow-y: auto; padding-right: 5px; margin-top: 15px;">
                ${!person ? `
                    <button class="btn btn-primary w-full" id="add-comm-btn" style="margin-bottom: 20px;">
                        ${getIcon('plus')} Nuevo Mensaje
                    </button>
                ` : ''}

                <div class="comm-list" style="display: flex; flex-direction: column; gap: 8px;">
                    ${sortedComms.length === 0 ? `
                        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); opacity: 0.5;">
                            ${getIcon('messageSquare', 'large-icon')}
                            <p style="margin-top: 10px;">No hay comunicaciones guardadas.</p>
                        </div>
                    ` : sortedComms.map(comm => renderCommItem(comm, person)).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderCommItem(comm, person = null) {
    const lastUsedByPerson = person && comm.lastUsed && comm.lastUsed[person.id];

    return `
        <div class="comm-item glass-panel" data-id="${comm.id}" style="padding: 10px 12px; position: relative; cursor: pointer; transition: transform 0.2s; border: 1px solid ${lastUsedByPerson ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)'}; margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                <h4 style="margin: 0; font-size: 13px; font-weight: 600;">${comm.title}</h4>
                <div style="display: flex; align-items: center; gap: 4px;">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <span style="color: ${comm.rating >= star ? 'var(--accent-tertiary)' : 'rgba(255,255,255,0.05)'}; font-size: 9px;">★</span>
                    `).join('')}
                </div>
            </div>
            <p style="margin: 0; font-size: 11px; color: var(--text-secondary); white-space: pre-wrap; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; opacity: 0.8;">${comm.text}</p>
            
            ${!person ? `
                <div class="comm-actions" style="margin-top: 8px; display: flex; gap: 6px; justify-content: flex-end;">
                    <button class="icon-btn edit-comm" data-id="${comm.id}" style="width: 28px; height: 28px; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); color: var(--text-primary); border-radius: 6px;">${getIcon('edit', 'tiny-icon')}</button>
                    <button class="icon-btn move-up-comm" data-id="${comm.id}" style="width: 28px; height: 28px; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); color: var(--text-primary); border-radius: 6px;">${getIcon('chevronUp', 'tiny-icon')}</button>
                    <button class="icon-btn move-down-comm" data-id="${comm.id}" style="width: 28px; height: 28px; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); color: var(--text-primary); border-radius: 6px;">${getIcon('chevronDown', 'tiny-icon')}</button>
                    <button class="icon-btn delete-comm" data-id="${comm.id}" style="width: 28px; height: 28px; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(239, 68, 68, 0.15); color: #ff5f5f; border-radius: 6px;">${getIcon('trash', 'tiny-icon')}</button>
                </div>
            ` : `
                <div style="margin-top: 4px; display: flex; justify-content: flex-end;">
                    ${lastUsedByPerson ? `<span style="font-size: 8px; color: var(--accent-primary); font-weight: 800; letter-spacing: 0.5px;">USADO</span>` : ''}
                </div>
            `}
        </div>
    `;
}

function setupListeners(overlay, person = null) {
    overlay.querySelector('.modal-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    // Add new comm
    const addBtn = overlay.querySelector('#add-comm-btn');
    if (addBtn) {
        addBtn.onclick = async () => {
            const result = await openEditCommModal();
            if (result) {
                store.addCommunication(result);
                renderModal(overlay, person);
                setupListeners(overlay, person);
            }
        };
    }

    // List items
    overlay.querySelectorAll('.comm-item').forEach(item => {
        item.onclick = (e) => {
            if (e.target.closest('.icon-btn')) return;
            const commId = item.dataset.id;
            const comm = store.getState().social.communications.find(c => c.id === commId);
            if (!comm) return;

            if (person) {
                // Selection mode
                navigator.clipboard.writeText(comm.text).then(() => {
                    store.logCommunicationUsed(commId, person.id);
                    ns.toast('Copiado al portapapeles y registrado', 'success');
                    overlay.remove();
                });
            } else {
                // Management mode - maybe show details or do nothing
            }
        };
    });

    // Actions (Edit, Delete, Move)
    overlay.querySelectorAll('.edit-comm').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const commId = btn.dataset.id;
            console.log('[CommModal] Edit clicked for', commId);
            const comm = store.getState().social.communications.find(c => c.id === commId);
            if (!comm) return;
            const result = await openEditCommModal(comm);
            if (result) {
                store.updateCommunication(commId, result);
                renderModal(overlay, person);
                setupListeners(overlay, person);
            }
        });
    });

    overlay.querySelectorAll('.delete-comm').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (await ns.confirm('Eliminar Comunicación', '¿Estás seguro?')) {
                store.deleteCommunication(btn.dataset.id);
                renderModal(overlay, person);
                setupListeners(overlay, person);
            }
        });
    });

    overlay.querySelectorAll('.move-up-comm').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            moveComm(btn.dataset.id, -1, overlay, person);
        });
    });

    overlay.querySelectorAll('.move-down-comm').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            moveComm(btn.dataset.id, 1, overlay, person);
        });
    });
}

function moveComm(id, direction, overlay, person) {
    const comms = [...store.getState().social.communications].sort((a, b) => a.order - b.order);
    const idx = comms.findIndex(c => c.id === id);
    const targetIdx = idx + direction;
    if (targetIdx >= 0 && targetIdx < comms.length) {
        const temp = comms[idx].order;
        comms[idx].order = comms[targetIdx].order;
        comms[targetIdx].order = temp;
        store.reorderCommunications(comms);
        renderModal(overlay, person);
        setupListeners(overlay, person);
    }
}

function openEditCommModal(comm = null) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.style.zIndex = '11000';
        overlay.innerHTML = `
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h2 class="modal-title">${comm ? 'Editar Mensaje' : 'Nuevo Mensaje'}</h2>
                    <button class="modal-close">${getIcon('x')}</button>
                </div>
                <div class="modal-body" style="padding: 20px 0;">
                    <div class="form-group">
                        <label class="form-label">Título / Asunto</label>
                        <input type="text" id="comm-title" class="form-input" value="${comm?.title || ''}" placeholder="Ej: Saludo inicial">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Mensaje (para copiar)</label>
                        <textarea id="comm-text" class="form-input" rows="6" placeholder="Escribe el mensaje aquí...">${comm?.text || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Puntuación / Efectividad (1-5)</label>
                        <input type="range" id="comm-rating" min="1" max="5" step="1" value="${comm?.rating || 1}" class="form-range">
                        <div id="comm-rating-val" style="text-align: center; font-weight: bold; margin-top: 5px;">${comm?.rating || 1}</div>
                    </div>
                    <button class="btn btn-primary w-full" id="save-comm" style="margin-top: 20px;">Guardar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const close = () => { overlay.remove(); resolve(null); };
        overlay.querySelector('.modal-close').onclick = close;

        const ratingInput = overlay.querySelector('#comm-rating');
        const ratingVal = overlay.querySelector('#comm-rating-val');
        ratingInput.oninput = () => ratingVal.textContent = ratingInput.value;

        overlay.querySelector('#save-comm').onclick = () => {
            const title = overlay.querySelector('#comm-title').value.trim();
            const text = overlay.querySelector('#comm-text').value.trim();
            const rating = parseInt(overlay.querySelector('#comm-rating').value);

            if (!title || !text) {
                ns.toast('Título y texto son obligatorios', 'error');
                return;
            }

            overlay.remove();
            resolve({ title, text, rating });
        };
    });
}
