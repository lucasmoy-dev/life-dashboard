import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

export function renderAestheticsPage() {
    const { aesthetics } = store.getState();
    const items = aesthetics || [];
    const currentItems = items.filter(i => i.category === 'current');
    const nextItems = items.filter(i => i.category === 'next');

    // Calculate Average (Score de Apariencia)
    const avgScore = currentItems.length > 0
        ? Math.round(currentItems.reduce((sum, i) => sum + i.level, 0) / currentItems.length)
        : 0;

    return `
    <div class="aesthetics-page stagger-children" style="padding-bottom: 80px;">
        <header class="page-header" style="margin-bottom: var(--spacing-md);">
            <h1 class="page-title">Aesthetics & Appearance</h1>
            <p class="page-subtitle">Optimiza tu imagen personal y planifica mejoras visuales</p>
        </header>

        <!-- OVERALL SCORE HIGHLIGHT -->
        <div class="card highlight-card" style="margin-bottom: var(--spacing-xl); background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%); border-color: rgba(236, 72, 153, 0.3);">
            <div class="card-header">
                <span class="card-title" style="color: #ec4899;">Aesthetics Score</span>
                ${getIcon('user', 'card-icon')}
            </div>
            <div class="highlight-value" style="color: #ec4899; background: none !important; -webkit-text-fill-color: initial !important;">${avgScore}<span style="font-size: 16px; opacity: 0.6;">/100</span></div>
            <div class="highlight-label">
                ${avgScore > 85 ? '✨ Nivel Model Look' : (avgScore > 65 ? '🔥 Atractivo Superior' : '👌 En fase de optimización')}
            </div>
        </div>

        <div class="aesthetics-grid" style="display: grid; grid-template-columns: 1fr; gap: var(--spacing-xl);">
            <!-- CURRENT ATTRIBUTES -->
            <section class="aesthetics-section">
                <div class="section-divider">
                    <span class="section-title">Atributos Actuales</span>
                    <button class="icon-btn add-aesthetic-btn" data-category="current" style="color: white !important;">${getIcon('plus')}</button>
                </div>
                <div class="aesthetics-list" data-category="current">
                    ${currentItems.length === 0 ? renderEmptyAesthetics('current') : currentItems.map(i => renderAestheticItem(i)).join('')}
                </div>
            </section>

            <!-- UPCOMING REFINEMENTS -->
            <section class="aesthetics-section">
                <div class="section-divider">
                    <span class="section-title">Próximos Refinamientos (To-Do)</span>
                    <button class="icon-btn add-aesthetic-btn" data-category="next" style="color: white !important;">${getIcon('plus')}</button>
                </div>
                <div class="aesthetics-list" data-category="next" style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                    ${nextItems.length === 0 ? renderEmptyAesthetics('next') : nextItems.map(i => renderNextAestheticItem(i)).join('')}
                </div>
            </section>
        </div>
    </div>
    `;
}

function renderAestheticItem(item) {
    return `
    <div class="card aesthetic-card draggable-aesthetic" 
         data-id="${item.id}" 
         data-category="${item.category}" 
         draggable="true"
         style="margin-bottom: 8px; padding: 10px 16px !important; cursor: grab; border-left: 3px solid #ec4899;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="color: var(--text-muted); opacity: 0.5; cursor: grab; display: flex; align-items: center;">
                    ${getIcon('menu')}
                </div>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${item.name}</div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="icon-btn edit-aesthetic" data-id="${item.id}" style="color: white !important; width: 30px; height: 30px; padding: 0;">${getIcon('edit')}</button>
                <button class="icon-btn delete-aesthetic" data-id="${item.id}" style="color: var(--accent-danger); width: 30px; height: 30px; padding: 0;">${getIcon('trash')}</button>
            </div>
        </div>
        <div class="aesthetic-progress-container" style="background: rgba(255,255,255,0.05); height: 5px; border-radius: 3px; overflow: hidden; position: relative;">
            <div class="aesthetic-progress-fill" style="width: ${item.level}%; height: 100%; background: #ec4899; border-radius: 3px; transition: width 0.5s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; font-weight: 600; color: var(--text-muted);">
            <span>Nivel de Atractivo</span>
            <span style="color: #ec4899;">${item.level}%</span>
        </div>
    </div>
    `;
}

function renderNextAestheticItem(item) {
    return `
    <div class="card next-aesthetic-card draggable-aesthetic edit-aesthetic" 
         data-id="${item.id}" 
         data-category="${item.category}" 
         draggable="true"
         style="padding: 12px 15px !important; display: flex; align-items: center; justify-content: space-between; border: 1px dashed rgba(236, 72, 153, 0.2); background: rgba(236, 72, 153, 0.02); height: auto; cursor: grab;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="color: var(--text-muted); opacity: 0.5; display: flex; align-items: center;">
                ${getIcon('menu')}
            </div>
            <div style="font-weight: 700; font-size: 14px; color: var(--text-primary); text-align: left;">${item.name}</div>
        </div>
        <div style="color: #ec4899; opacity: 0.6;">${getIcon('target')}</div>
    </div>
    `;
}

function renderEmptyAesthetics(cat) {
    return `
    <div class="empty-state" style="padding: 20px; background: rgba(255,255,255,0.02); border-radius: 15px; border: 1px dashed rgba(255,255,255,0.05);">
        <p style="font-size: 13px; color: var(--text-muted); text-align: center;">${cat === 'current' ? 'Añade tus rasgos físicos a optimizar' : 'Planifica tu próximo glow up'}</p>
    </div>
    `;
}

export function setupAestheticsListeners() {
    // Add Item
    document.querySelectorAll('.add-aesthetic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openAestheticModal(null, btn.dataset.category);
        });
    });

    // Edit Item
    document.querySelectorAll('.edit-aesthetic').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id || btn.closest('.edit-aesthetic')?.dataset.id;
            const item = store.getState().aesthetics.find(i => i.id === id);
            if (item) openAestheticModal(item);
        });
    });

    // Delete Item
    document.querySelectorAll('.delete-aesthetic').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const confirmed = await ns.confirm('Eliminar Atributo', '¿Estás seguro de que quieres eliminar este elemento?');
            if (confirmed) {
                store.deleteAesthetic(id);
                ns.toast('Eliminado del perfil');
            }
        });
    });

    // Drag and Drop Logic
    const lists = document.querySelectorAll('.aesthetics-list');
    let draggedId = null;

    document.querySelectorAll('.draggable-aesthetic').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedId = card.dataset.id;
            card.classList.add('dragging');
            card.style.opacity = '0.4';
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            card.style.opacity = '1';
            document.querySelectorAll('.aesthetics-list').forEach(l => l.classList.remove('drag-over'));
        });
    });

    lists.forEach(list => {
        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            list.classList.add('drag-over');
        });

        list.addEventListener('dragleave', () => {
            list.classList.remove('drag-over');
        });

        list.addEventListener('drop', (e) => {
            e.preventDefault();
            list.classList.remove('drag-over');

            const allItems = [...(store.getState().aesthetics || [])];
            const draggedIndex = allItems.findIndex(i => i.id === draggedId);
            if (draggedIndex === -1) return;

            const draggedItem = { ...allItems[draggedIndex] };
            allItems.splice(draggedIndex, 1);

            const afterElement = getDragAfterElement(list, e.clientY);
            if (afterElement == null) {
                allItems.push(draggedItem);
            } else {
                const targetId = afterElement.dataset.id;
                const targetIdx = allItems.findIndex(i => i.id === targetId);
                allItems.splice(targetIdx, 0, draggedItem);
            }

            store.reorderAestheticsList(allItems);
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable-aesthetic:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

export function openAestheticModal(item = null, initialCategory = 'current') {
    const isEdit = !!item;
    const cat = isEdit ? item.category : initialCategory;
    const level = isEdit ? item.level : 50;
    const modalId = `modal-aesthetics-${Date.now()}`;

    ns._showModal({
        title: isEdit ? 'Editar Atributo' : 'Aesthetic Upgrade',
        message: isEdit ? 'Actualiza los detalles de tu rasgo físico' : 'Define un nuevo rasgo para tu perfil estético',
        centered: true,
        content: `
            <div id="${modalId}" style="margin-top: var(--spacing-md);">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label">Tipo de Elemento</label>
                    <div style="display: flex; gap: 8px; background: rgba(255,255,255,0.05); padding: 4px; border-radius: 12px;">
                        <button type="button" class="btn cat-btn ${cat === 'current' ? 'active' : ''}" id="aes-cat-current" style="flex: 1; padding: 10px; border-radius: 9px; font-size: 11px; font-weight: 700; background: ${cat === 'current' ? '#ec4899' : 'transparent'}; color: ${cat === 'current' ? '#fff' : 'var(--text-muted)'}; border: none;">ATRIBUTO ACTUAL</button>
                        <button type="button" class="btn cat-btn ${cat === 'next' ? 'active' : ''}" id="aes-cat-next" style="flex: 1; padding: 10px; border-radius: 9px; font-size: 11px; font-weight: 700; background: ${cat === 'next' ? '#ec4899' : 'transparent'}; color: ${cat === 'next' ? '#fff' : 'var(--text-muted)'}; border: none;">MEJORA FUTURA</button>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label">Nombre del Atributo/Mejora</label>
                    <input type="text" id="aes-name" class="form-input" placeholder="Ej: Pelo, Mandíbula, Piel..." value="${isEdit ? item.name : ''}" autofocus>
                </div>

                <div id="aes-level-container" style="display: ${cat === 'current' ? 'block' : 'none'};">
                    <div class="form-group">
                        <label class="form-label">Nivel Actual: <span id="aes-level-val" style="color: #ec4899; font-weight: 800;">${level}%</span></label>
                        <input type="range" id="aes-level" min="1" max="100" value="${level}" style="width: 100%; accent-color: #ec4899; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); cursor: pointer;">
                    </div>
                </div>
            </div>
        `,
        buttons: [
            { text: 'Cancelar', type: 'secondary', onClick: () => { } },
            {
                text: isEdit ? 'Actualizar' : 'Guardar Cambio',
                type: 'primary',
                style: 'background: #ec4899; border: none; font-weight: 800;',
                onClick: () => {
                    const name = document.getElementById('aes-name').value.trim();
                    const currentCategory = document.getElementById('aes-cat-current').classList.contains('active') ? 'current' : 'next';
                    const currentLevel = parseInt(document.getElementById('aes-level').value);

                    if (!name) {
                        ns.toast('El nombre es obligatorio', 'error');
                        return;
                    }

                    if (isEdit) {
                        store.updateAesthetic(item.id, {
                            name,
                            category: currentCategory,
                            level: currentCategory === 'current' ? currentLevel : 0
                        });
                        ns.toast('Perfil estético actualizado');
                    } else {
                        store.addAesthetic({
                            name,
                            category: currentCategory,
                            level: currentCategory === 'current' ? currentLevel : 0
                        });
                        ns.toast('Nuevo rasgo añadido');
                    }
                }
            }
        ]
    });

    setTimeout(() => {
        const btnCurrent = document.getElementById('aes-cat-current');
        const btnNext = document.getElementById('aes-cat-next');
        const levelContainer = document.getElementById('aes-level-container');
        const levelRange = document.getElementById('aes-level');
        const levelVal = document.getElementById('aes-level-val');

        const updateUI = (newCat) => {
            if (newCat === 'current') {
                btnCurrent.style.background = '#ec4899';
                btnCurrent.style.color = '#fff';
                btnCurrent.classList.add('active');
                btnNext.style.background = 'transparent';
                btnNext.style.color = 'var(--text-muted)';
                btnNext.classList.remove('active');
                levelContainer.style.display = 'block';
            } else {
                btnNext.style.background = '#ec4899';
                btnNext.style.color = '#fff';
                btnNext.classList.add('active');
                btnCurrent.style.background = 'transparent';
                btnCurrent.style.color = 'var(--text-muted)';
                btnCurrent.classList.remove('active');
                levelContainer.style.display = 'none';
            }
        };

        btnCurrent.onclick = () => updateUI('current');
        btnNext.onclick = () => updateUI('next');
        levelRange.oninput = () => {
            levelVal.textContent = levelRange.value + '%';
        };
    }, 100);
}
