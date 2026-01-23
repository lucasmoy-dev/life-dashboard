/**
 * Notification Service - Custom Modals, Toasts and Prompts
 * Premium, non-blocking and Apple-style aesthetics.
 */
import { getIcon } from './icons.js';

class NotificationService {
    constructor() {
        this.toastContainer = null;
        this._initToastContainer();
    }

    _initToastContainer() {
        if (document.getElementById('toast-container')) return;
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.className = 'toast-container';
        document.body.appendChild(this.toastContainer);
    }

    /**
     * Show a simple toast message
     */
    toast(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} stagger-in`;

        const icon = type === 'success' ? 'check' : (type === 'error' ? 'alertCircle' : 'info');

        toast.innerHTML = `
            <div class="toast-content">
                ${getIcon(icon, 'toast-icon')}
                <span>${message}</span>
            </div>
        `;

        this.toastContainer.appendChild(toast);

        // Remove after duration
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, duration);
    }

    /**
     * Custom Alert Modal (Centered)
     */
    alert(title, message) {
        return new Promise((resolve) => {
            this._showModal({
                title,
                message,
                centered: true,
                buttons: [
                    { text: 'Entendido', type: 'primary', onClick: () => resolve(true) }
                ]
            });
        });
    }

    /**
     * Custom Confirm Modal (Centered)
     */
    confirm(title, message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
        return new Promise((resolve) => {
            this._showModal({
                title,
                message,
                centered: true,
                buttons: [
                    { text: cancelText, type: 'secondary', onClick: () => resolve(false) },
                    { text: confirmText, type: 'danger', onClick: () => resolve(true) }
                ]
            });
        });
    }

    /**
     * Custom Prompt Modal (Centered)
     */
    prompt(title, message, initialValue = '', inputType = 'text') {
        return new Promise((resolve) => {
            const inputId = `prompt-input-${Date.now()}`;
            this._showModal({
                title,
                message,
                centered: true,
                content: `
                    <div class="form-group" style="margin-top: var(--spacing-md);">
                        <input type="${inputType}" id="${inputId}" class="form-input" value="${initialValue}" autofocus>
                    </div>
                `,
                buttons: [
                    { text: 'Cancelar', type: 'secondary', onClick: () => resolve(null) },
                    {
                        text: 'Aceptar',
                        type: 'primary',
                        onClick: () => {
                            const val = document.getElementById(inputId).value;
                            resolve(val);
                        }
                    }
                ]
            });
            // Focus and select text
            setTimeout(() => {
                const input = document.getElementById(inputId);
                if (input) {
                    input.focus();
                    if (input.select) input.select();
                }
            }, 100);
        });
    }

    /**
     * Custom Selection Modal
     */
    select(title, message, options = [], columns = 4) {
        return new Promise((resolve) => {
            const gridStyle = `display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 8px; margin-top: 16px;`;
            this._showModal({
                title,
                message,
                centered: true,
                content: `
                    <div style="${gridStyle}">
                        ${options.map((opt, i) => `
                            <button class="btn btn-secondary select-option-btn" style="padding: 15px 4px; font-size: 15px; font-weight: 700;" data-value="${opt.value || opt}">
                                ${opt.label || opt}
                            </button>
                        `).join('')}
                    </div>
                `,
                buttons: [
                    { text: 'Cancelar', type: 'secondary', onClick: () => resolve(null) }
                ]
            });

            // Attach listeners to options
            const modal = document.querySelector('.modal-overlay.active');
            if (modal) {
                modal.querySelectorAll('.select-option-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        resolve(btn.dataset.value);
                        this._closeModal(modal);
                    });
                });
            }
        });
    }

    /**
     * Dangerous Action Confirmation (e.g. Factory Reset)
     * Requires typing a specific word to confirm.
     */
    hardConfirm(title, message, requiredWord = 'BORRAR') {
        return new Promise((resolve) => {
            const inputId = `hard-confirm-input-${Date.now()}`;
            const btnId = `hard-confirm-btn-${Date.now()}`;

            this._showModal({
                title,
                message: `<div style="color: var(--accent-danger); font-weight: 600; margin-bottom: 8px;">ACCIÓN IRREVERSIBLE</div>${message}<br><br>Escribe <strong>${requiredWord}</strong> para confirmar:`,
                centered: true,
                content: `
                    <div class="form-group" style="margin-top: var(--spacing-sm);">
                        <input type="text" id="${inputId}" class="form-input" style="text-align: center; font-weight: 800; border-color: rgba(239, 68, 68, 0.2);" placeholder="..." autofocus autocomplete="off">
                    </div>
                `,
                buttons: [
                    { text: 'Cancelar', type: 'secondary', onClick: () => resolve(false) },
                    {
                        text: 'Borrar Todo',
                        type: 'danger',
                        id: btnId,
                        disabled: true,
                        onClick: () => resolve(true)
                    }
                ]
            });

            const input = document.getElementById(inputId);
            const btn = document.getElementById(btnId);

            input.addEventListener('input', () => {
                const match = input.value.trim().toUpperCase() === requiredWord.toUpperCase();
                btn.disabled = !match;
                btn.style.opacity = match ? '1' : '0.3';
                btn.style.pointerEvents = match ? 'auto' : 'none';
            });
        });
    }

    /**
     * Rating with Emojis
     */
    performance(title, message) {
        const options = [
            { rating: 1, emoji: '😰', label: 'Duro' },
            { rating: 3, emoji: '😐', label: 'Bien' },
            { rating: 5, emoji: '😄', label: 'Fácil' }
        ];

        return new Promise((resolve) => {
            this._showModal({
                title,
                message,
                centered: true,
                content: `
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px;">
                        ${options.map(opt => `
                            <button class="btn btn-secondary perf-emoji-btn" data-value="${opt.rating}" style="display: flex; flex-direction: column; align-items: center; padding: 15px 5px; gap: 8px;">
                                <span style="font-size: 32px;">${opt.emoji}</span>
                                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase;">${opt.label}</span>
                            </button>
                        `).join('')}
                    </div>
                `,
                buttons: [
                    { text: 'Cancelar', type: 'secondary', onClick: () => resolve(null) }
                ]
            });

            const modal = document.querySelector('.modal-overlay.active');
            if (modal) {
                modal.querySelectorAll('.perf-emoji-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        resolve(parseInt(btn.dataset.value));
                        this._closeModal(modal);
                    });
                });
            }
        });
    }

    _showModal({ title, message, content = '', buttons = [], centered = false }) {
        const overlay = document.createElement('div');
        overlay.className = `modal-overlay ${centered ? 'overlay-centered' : ''}`;
        overlay.style.zIndex = '9999';

        const modalId = `modal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        overlay.id = modalId;

        const modalHtml = `
            <div class="modal premium-alert-modal animate-pop">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                </div>
                <div class="modal-body">
                    <div style="color: var(--text-secondary); line-height: 1.5; font-size: 14px;">${message}</div>
                    ${content}
                </div>
                <div class="modal-footer" style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                    ${buttons.map((btn, i) => `
                        <button class="btn btn-${btn.type} w-full" data-index="${i}" style="min-height: 48px; font-size: 16px; ${btn.disabled ? 'opacity: 0.3; pointer-events: none;' : ''}" ${btn.id ? `id="${btn.id}"` : ''}>
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        overlay.innerHTML = modalHtml;
        document.body.appendChild(overlay);

        overlay.offsetHeight;
        overlay.classList.add('active');

        const modalBtnElements = overlay.querySelectorAll('.modal-footer button');
        modalBtnElements.forEach(el => {
            const index = el.dataset.index;
            if (index !== undefined) {
                const btn = buttons[index];
                el.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    try {
                        if (btn.onClick) await btn.onClick();
                        await this._closeModal(overlay);
                    } catch (err) {
                        console.error('Modal button action failed', err);
                    }
                });
            }
        });

        overlay.addEventListener('click', async (e) => {
            if (e.target === overlay) {
                const isDangerous = buttons.some(b => b.type === 'danger');
                if (!isDangerous) {
                    const cancelBtn = buttons.find(b => b.type === 'secondary');
                    if (cancelBtn) cancelBtn.onClick();
                    await this._closeModal(overlay);
                }
            }
        });
    }

    async _closeModal(overlay) {
        overlay.classList.remove('active');
        const modal = overlay.querySelector('.modal');
        if (modal) modal.classList.add('animate-out');
        return new Promise(resolve => {
            setTimeout(() => {
                overlay.remove();
                resolve();
            }, 300);
        });
    }
}

export const ns = new NotificationService();
