/**
 * Add Person Modal - Dedicated modal for Social CRM
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

let modalElement = null;
let editingId = null;

export function openAddPersonModal(personToEdit = null) {
    console.log('[LeadModal] Opening modal', { personToEdit });

    // Clean up any existing modal first
    const existing = document.getElementById('add-person-modal');
    if (existing) {
        console.log('[LeadModal] Removing existing modal');
        existing.remove();
    }

    editingId = personToEdit ? personToEdit.id : null;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'add-person-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.innerHTML = renderModal(personToEdit);

    document.body.appendChild(overlay);

    // Trigger animation
    setTimeout(() => {
        overlay.classList.add('active');
        // Focus first input
        overlay.querySelector('#person-name')?.focus();
    }, 50);

    setupModalListeners(overlay);
}

function renderModal(person = null) {
    const title = person ? 'Editar Lead' : 'Lead';
    const btnText = person ? 'Guardar Cambios' : 'Lead';

    return `
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <div class="header-title-wrapper" style="display: flex; align-items: center; gap: 12px;">
            <div style="background: var(--gradient-primary); width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--bg-primary); box-shadow: var(--shadow-sm);">
                ${getIcon('plus')}
            </div>
            <h2 class="modal-title">${title}</h2>
        </div>
        <button class="modal-close" id="person-modal-close">
          ${getIcon('x')}
        </button>
      </div>
      
      <div id="person-form-container" style="margin-top: var(--spacing-lg);">
        <div class="form-group">
            <label class="form-label">Nombre Completo</label>
            <input type="text" class="form-input" id="person-name" placeholder="Ej: Jhon Doe" value="${person?.name || ''}">
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input type="tel" class="form-input" id="person-phone" placeholder="+54 9 ..." value="${person?.phone || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Ciudad</label>
                <input type="text" class="form-input" id="person-city" placeholder="Ej: Buenos Aires" value="${person?.city || ''}">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Fuente de Contacto</label>
                <select class="form-input form-select" id="person-source">
                    ${store.getState().social.contactSources.map(src => `
                        <option value="${src}" ${person?.source === src ? 'selected' : ''}>${src}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Lead Alignment (1-10)</label>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" class="form-range" id="person-rating-slider" min="1" max="10" value="${person?.rating || 5}" style="flex: 1;">
                    <span id="rating-value" style="font-weight: bold; width: 24px; text-align: center;">${person?.rating || 5}</span>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Último Contacto</label>
                <input type="date" class="form-input" id="person-last-contact" value="${person?.lastContact || new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label class="form-label">Color del Lead</label>
                <div class="goal-color-dots" id="person-color-picker" style="justify-content: flex-start; margin-top: 0; background: none; border: none; padding: 5px 0;">
                    ${['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => `
                        <div class="goal-color-dot ${person?.color === color ? 'active' : (!person?.color && color === '#3b82f6' ? 'active' : '')}" 
                             data-color="${color}" 
                             style="background-color: ${color}; width: 28px; height: 28px;"></div>
                    `).join('')}
                </div>
                <input type="hidden" id="person-color-value" value="${person?.color || '#3b82f6'}">
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Notas / Descripción</label>
            <textarea class="form-input" id="person-desc" rows="3" placeholder="Detalles importantes, gustos, temas de conversación...">${person?.description || ''}</textarea>
        </div>

        <div class="form-group" style="margin-top: var(--spacing-md);">
             <label class="form-label">Etapa</label>
             <select class="form-input form-select" id="person-column">
                ${store.getState().social.columns
            .sort((a, b) => a.order - b.order)
            .map(c => `<option value="${c.id}" ${person?.columnId === c.id ? 'selected' : ''}>${c.name}</option>`)
            .join('')}
             </select>
        </div>
        
        <div style="margin-top: var(--spacing-xl); display: flex; gap: 10px;">
            ${editingId ? `
            <button class="btn btn-secondary" id="btn-delete-person" style="padding: 14px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">
                ${getIcon('trash')}
            </button>` : ''}
            <button class="btn btn-primary w-full" id="btn-save-person-lead" style="padding: 14px;">
                ${getIcon('plus')} ${btnText}
            </button>
        </div>
      </div>
    </div>
  `;
}

function setupModalListeners(overlay) {
    const closeBtn = overlay.querySelector('#person-modal-close');
    const saveBtn = overlay.querySelector('#btn-save-person-lead');
    const deleteBtn = overlay.querySelector('#btn-delete-person');
    const ratingSlider = overlay.querySelector('#person-rating-slider');
    const ratingValue = overlay.querySelector('#rating-value');

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            console.log('[LeadModal] Overlay clicked, closing');
            closeModal(overlay);
        }
    });

    closeBtn?.addEventListener('click', () => {
        console.log('[LeadModal] Close button clicked');
        closeModal(overlay);
    });

    if (ratingSlider && ratingValue) {
        const updateRating = () => {
            console.log('[LeadModal] Slider updated:', ratingSlider.value);
            ratingValue.textContent = ratingSlider.value;
        };
        ratingSlider.oninput = updateRating;
        ratingSlider.onchange = updateRating;
    }

    if (saveBtn) {
        saveBtn.onclick = (e) => {
            e.preventDefault();
            console.log('[LeadModal] Save button clicked');
            handleSave(overlay);
        };
    }

    if (deleteBtn) {
        deleteBtn.onclick = (e) => {
            e.preventDefault();
            console.log('[LeadModal] Delete button clicked');
            handleDelete(overlay);
        };
    }

    // Color picker
    const colorDots = overlay.querySelectorAll('.goal-color-dot');
    const colorInput = overlay.querySelector('#person-color-value');
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            if (colorInput) colorInput.value = dot.dataset.color;
            console.log('[LeadModal] Color selected:', dot.dataset.color);
        });
    });
}

async function handleDelete(overlay) {
    if (!editingId) return;
    if (await ns.confirm('Eliminar Lead', '¿Estás seguro de eliminar este lead?')) {
        store.deletePerson(editingId);
        ns.toast('Lead eliminado', 'success');
        closeModal(overlay);
    }
}

function handleSave(overlay) {
    const saveBtn = overlay.querySelector('#btn-save-person-lead');
    if (saveBtn.disabled) {
        console.log('[LeadModal] Save ignored, already processing');
        return;
    }

    try {
        const name = overlay.querySelector('#person-name')?.value?.trim();
        const phone = overlay.querySelector('#person-phone')?.value?.trim();
        const city = overlay.querySelector('#person-city')?.value?.trim();
        const source = overlay.querySelector('#person-source')?.value;
        const rating = overlay.querySelector('#person-rating-slider')?.value;
        const description = overlay.querySelector('#person-desc')?.value?.trim();
        const columnId = overlay.querySelector('#person-column')?.value;
        const color = overlay.querySelector('#person-color-value')?.value;
        const lastContact = overlay.querySelector('#person-last-contact')?.value;

        console.log('[LeadModal] Attempting to save', { name, rating, columnId, color, lastContact });

        if (!name) {
            console.warn('[LeadModal] Save failed: Missing name');
            ns.toast('El nombre es obligatorio', 'error');
            return;
        }

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="loading-spinner-sm"></span> Guardando...';

        const personData = {
            name,
            phone,
            city,
            source,
            rating: parseInt(rating) || 5,
            description,
            columnId,
            color,
            lastContact
        };

        if (editingId) {
            console.log('[LeadModal] Updating person', editingId);
            store.updatePerson(editingId, personData);
            ns.toast('Lead actualizado correctamente', 'success');
        } else {
            console.log('[LeadModal] Adding new person');
            store.addPerson(personData);
            ns.toast('Lead guardado correctamente', 'success');
        }

        console.log('[LeadModal] Save successful, closing modal');
        closeModal(overlay);
    } catch (err) {
        console.error('[LeadModal] Error saving lead:', err);
        ns.toast('Error al guardar el lead', 'error');
        saveBtn.disabled = false;
        saveBtn.innerHTML = `${getIcon('plus')} Lead`;
    }
}

function closeModal(overlay) {
    if (!overlay) return;
    console.log('[LeadModal] Closing modal');
    overlay.classList.remove('active');
    setTimeout(() => {
        if (overlay.parentNode) {
            console.log('[LeadModal] Removing modal from DOM');
            overlay.remove();
        }
    }, 400); // Slightly longer for safe animation
}
