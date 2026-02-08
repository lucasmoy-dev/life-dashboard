import { store } from '../store.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

export function renderSkillsPage() {
    const { skills } = store.getState();
    const currentSkills = (skills || []).filter(s => s.category === 'current');
    const nextSkills = (skills || []).filter(s => s.category === 'next');

    const avgExpertise = currentSkills.length > 0
        ? Math.round(currentSkills.reduce((sum, s) => sum + s.level, 0) / currentSkills.length)
        : 0;

    return `
    <div class="skills-page stagger-children" style="padding-bottom: 80px;">
        <header class="page-header" style="margin-bottom: var(--spacing-md);">
            <h1 class="page-title">Skills & Mastery</h1>
            <p class="page-subtitle">Gestiona tu nivel de expertise y planifica tu aprendizaje</p>
        </header>

        <!-- OVERALL MASTERY HIGHLIGHT -->
        <div class="card highlight-card" style="margin-bottom: var(--spacing-xl); background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%); border-color: rgba(124, 58, 237, 0.3);">
            <div class="card-header">
                <span class="card-title" style="color: #7c3aed;">Maestría Promedio</span>
                ${getIcon('brain', 'card-icon')}
            </div>
            <div class="highlight-value" style="color: #7c3aed;">${avgExpertise}<span style="font-size: 16px; opacity: 0.6;">%</span></div>
            <div class="highlight-label">
                ${avgExpertise > 80 ? '👑 Nivel experto en tu stack' : (avgExpertise > 50 ? '🛡️ Profesional competente' : '🌱 En fase de crecimiento')}
            </div>
        </div>

        <div class="skills-grid" style="display: grid; grid-template-columns: 1fr; gap: var(--spacing-xl);">
            <!-- CURRENT EXPERTISE -->
            <section class="skills-section">
                <div class="section-divider">
                    <span class="section-title">Nivel de Expertise</span>
                    <button class="icon-btn add-skill-btn" data-category="current">${getIcon('plus')}</button>
                </div>
                <div class="skills-list">
                    ${currentSkills.length === 0 ? renderEmptySkills('current') : currentSkills.map(s => renderSkillItem(s)).join('')}
                </div>
            </section>

            <!-- NEXT SKILLS TO DEVELOP -->
            <section class="skills-section">
                <div class="section-divider">
                    <span class="section-title">Próximos Desafíos</span>
                    <button class="icon-btn add-skill-btn" data-category="next">${getIcon('plus')}</button>
                </div>
                <div class="skills-list" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${nextSkills.length === 0 ? renderEmptySkills('next') : nextSkills.map(s => renderNextSkillItem(s)).join('')}
                </div>
            </section>
        </div>
    </div>
    `;
}

function renderSkillItem(skill) {
    return `
    <div class="card skill-card" style="margin-bottom: 12px; padding: 16px !important;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-weight: 700; color: var(--text-primary); font-size: 16px;">${skill.name}</div>
            <div style="display: flex; gap: 8px;">
                <button class="icon-btn edit-skill" data-id="${skill.id}">${getIcon('edit')}</button>
                <button class="icon-btn delete-skill" data-id="${skill.id}" style="color: var(--accent-danger);">${getIcon('trash')}</button>
            </div>
        </div>
        <div class="skill-progress-container" style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow: hidden; position: relative;">
            <div class="skill-progress-fill" style="width: ${skill.level}%; height: 100%; background: var(--accent-primary); border-radius: 4px; transition: width 0.5s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; font-weight: 600; color: var(--text-muted);">
            <span>Nivel de dominio</span>
            <span style="color: var(--accent-primary);">${skill.level}%</span>
        </div>
    </div>
    `;
}

function renderNextSkillItem(skill) {
    return `
    <div class="card next-skill-card clickable edit-skill" data-id="${skill.id}" style="padding: 15px !important; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px dashed rgba(255,255,255,0.1); background: rgba(255,255,255,0.02);">
        <div style="background: rgba(124, 58, 237, 0.1); color: #7c3aed; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
            ${getIcon('zap')}
        </div>
        <div style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${skill.name}</div>
    </div>
    `;
}

function renderEmptySkills(cat) {
    return `
    <div class="empty-state" style="padding: 20px; background: rgba(255,255,255,0.02); border-radius: 15px; border: 1px dashed rgba(255,255,255,0.05);">
        <p style="font-size: 13px; color: var(--text-muted); text-align: center;">Pulse + para añadir su primera skill</p>
    </div>
    `;
}

export function setupSkillsListeners() {
    // Add Skill
    document.querySelectorAll('.add-skill-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const category = btn.dataset.category;
            const name = await ns.prompt('Nueva Skill', `¿Qué skill quieres ${category === 'current' ? 'registrar' : 'aprender'}?`);
            if (name) {
                let level = 0;
                if (category === 'current') {
                    const levelStr = await ns.prompt('Nivel de Dominio', 'Del 0 al 100:', '50', 'number');
                    level = parseInt(levelStr) || 0;
                }
                store.addSkill({ name, level, category });
                ns.toast('Skill añadida');
            }
        });
    });

    // Edit Skill
    document.querySelectorAll('.edit-skill').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const skill = store.getState().skills.find(s => s.id === id);
            if (!skill) return;

            const newName = await ns.prompt('Editar Skill', 'Nombre:', skill.name);
            if (newName) {
                let newLevel = skill.level;
                if (skill.category === 'current') {
                    const levelStr = await ns.prompt('Nivel de Dominio', 'Del 0 al 100:', skill.level.toString(), 'number');
                    newLevel = parseInt(levelStr) || 0;
                }
                store.updateSkill(id, { name: newName, level: newLevel });
                ns.toast('Skill actualizada');
            }
        });
    });

    // Delete Skill
    document.querySelectorAll('.delete-skill').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const confirmed = await ns.confirm('Eliminar Skill', '¿Estás seguro de que quieres eliminar esta skill?');
            if (confirmed) {
                store.deleteSkill(id);
                ns.toast('Skill eliminada');
            }
        });
    });
}
