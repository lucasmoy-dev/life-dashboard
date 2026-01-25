/**
 * Add Person Modal - Dedicated modal for Social CRM
 */

import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

let modalElement = null;
let editingId = null;

export function openAddPersonModal(personToEdit = null) {
    editingId = personToEdit ? personToEdit.id : null;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'add-person-modal';
    overlay.innerHTML = renderModal(personToEdit);

    document.body.appendChild(overlay);
    modalElement = overlay;

    // Trigger animation
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    setupModalListeners();
}

function renderModal(person = null) {
    const title = person ? 'Editar Lead' : 'Nuevo Lead';
    const btnText = person ? 'Guardar Cambios' : 'Guardar Lead';

    return `
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <div class="header-title-wrapper" style="display: flex; align-items: center; gap: 12px;">
            <div style="background: var(--accent-primary); width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--bg-primary);">
                ${getIcon('users')}
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
            <input type="text" class="form-input" id="person-name" placeholder="Ej: Jhon Doe" value="${person?.name || ''}" autofocus>
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
                    <option value="Instagram" ${person?.source === 'Instagram' ? 'selected' : ''}>Instagram</option>
                    <option value="WhatsApp" ${person?.source === 'WhatsApp' ? 'selected' : ''}>WhatsApp</option>
                    <option value="Tinder" ${person?.source === 'Tinder' ? 'selected' : ''}>Tinder</option>
                    <option value="Bumble" ${person?.source === 'Bumble' ? 'selected' : ''}>Bumble</option>
                    <option value="LinkedIn" ${person?.source === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
                    <option value="Evento" ${person?.source === 'Evento' ? 'selected' : ''}>Evento</option>
                    <option value="Amigo" ${person?.source === 'Amigo' ? 'selected' : ''}>Amigo</option>
                    <option value="Otro" ${person?.source === 'Otro' ? 'selected' : ''}>Otro</option>
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
            <button class="btn btn-primary w-full" id="btn-save-person" style="padding: 14px;">
                ${getIcon('plus')} ${btnText}
            </button>
        </div>
      </div>
    </div>
  `;
}

function setupModalListeners() {
    const overlay = document.getElementById('add-person-modal');
    const closeBtn = document.getElementById('person-modal-close');
    const saveBtn = document.getElementById('btn-save-person');
    const deleteBtn = document.getElementById('btn-delete-person');
    const ratingSlider = document.getElementById('person-rating-slider');
    const ratingValue = document.getElementById('rating-value');

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    closeBtn.addEventListener('click', closeModal);

    if (ratingSlider && ratingValue) {
        ratingSlider.addEventListener('input', (e) => {
            ratingValue.textContent = e.target.value;
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', handleSave);
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDelete);
    }
}

async function handleDelete() {
    if (!editingId) return;
    if (await ns.confirm('Eliminar Lead', '¿Estás seguro de eliminar este lead?')) {
        store.deletePerson(editingId);
        ns.toast('Lead eliminado', 'success');
        closeModal();
    }
}

function handleSave() {
    const name = document.getElementById('person-name')?.value?.trim();
    const phone = document.getElementById('person-phone')?.value?.trim();
    const city = document.getElementById('person-city')?.value?.trim();
    const source = document.getElementById('person-source')?.value;
    const rating = document.getElementById('person-rating-slider')?.value;
    const description = document.getElementById('person-desc')?.value?.trim();
    const columnId = document.getElementById('person-column')?.value;

    if (!name) {
        ns.toast('El nombre es obligatorio', 'error');
        return;
    }

    const personData = {
        name,
        phone,
        city,
        source,
        rating,
        description,
        columnId
    };

    if (editingId) {
        store.updatePerson(editingId, personData);
        ns.toast('Lead actualizado correctamente', 'success');
    } else {
        store.addPerson(personData);
        ns.toast('Lead guardado correctamente', 'success');
    }
    closeModal();
}

function closeModal() {
    const overlay = document.getElementById('add-person-modal');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}
