import { store } from '../store.js';
import { AuthService } from '../services/AuthService.js';
import { getIcon } from '../utils/icons.js';
import { ns } from '../utils/notifications.js';

export function renderAuthShield() {
    const isSetup = AuthService.isSetup();
    const isBioEnabled = AuthService.isBioEnabled();

    return `
    <div id="auth-shield" class="auth-shield">
        <div class="auth-card stagger-children">
            <div class="auth-header">
                <div class="auth-logo">
                    ${getIcon('lock', 'auth-icon')}
                </div>
                <h1 class="auth-title">${isSetup ? 'Bienvenida de nuevo' : 'Configura tu Bóveda'}</h1>
                <p class="auth-subtitle">${isSetup ? 'Introduce tu contraseña para entrar' : 'Crea una contraseña maestra para proteger tus datos'}</p>
            </div>

            <div class="auth-form">
                <div class="input-group">
                    <input type="password" id="auth-password" class="form-input" placeholder="Contraseña maestra" autofocus>
                </div>
                
                ${!isSetup ? `
                <div class="input-group">
                    <input type="password" id="auth-confirm" class="form-input" placeholder="Confirmar contraseña">
                </div>
                ` : ''}

                <button id="auth-submit-btn" class="btn btn-primary w-full">
                    ${isSetup ? 'Desbloquear' : 'Empezar'}
                </button>

                ${isSetup && isBioEnabled ? `
                <button id="auth-bio-btn" class="btn btn-secondary w-full" style="margin-top: var(--spacing-sm);">
                    ${getIcon('fingerprint')} Usar Huella
                </button>
                ` : ''}
            </div>

            <div class="auth-footer">
                <p>Tus datos se encriptan localmente y nunca salen de tu dispositivo sin tu permiso.</p>
            </div>
        </div>
    </div>
    `;
}

export function setupAuthListeners(onAuthenticated) {
    const submitBtn = document.getElementById('auth-submit-btn');
    const bioBtn = document.getElementById('auth-bio-btn');
    const passInput = document.getElementById('auth-password');

    const handleAuth = async () => {
        const password = passInput.value;
        const confirmInput = document.getElementById('auth-confirm');
        const isSetup = AuthService.isSetup();

        try {
            let vaultKey;
            if (!isSetup) {
                if (!password || password.length < 4) throw new Error('Contraseña demasiado corta');
                if (password !== confirmInput.value) throw new Error('Las contraseñas no coinciden');
                vaultKey = await AuthService.setup(password);
            } else {
                vaultKey = await AuthService.unlock(password);
            }

            // Decrypt local state if it exists
            await store.loadEncrypted(vaultKey);

            onAuthenticated();
        } catch (e) {
            ns.alert('Error', e.message);
        }
    };

    submitBtn?.addEventListener('click', handleAuth);

    // Support Enter key on both inputs
    passInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAuth();
        }
    });

    document.getElementById('auth-confirm')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAuth();
        }
    });

    bioBtn?.addEventListener('click', async () => {
        try {
            const vaultKey = await AuthService.unlockWithBiometrics();
            await store.loadEncrypted(vaultKey);
            onAuthenticated();
        } catch (e) {
            ns.alert('Identificación', e.message);
        }
    });

    // Auto-trigger biometrics if enabled
    if (AuthService.isBioEnabled()) {
        setTimeout(async () => {
            try {
                const vaultKey = await AuthService.unlockWithBiometrics();
                await store.loadEncrypted(vaultKey);
                onAuthenticated();
            } catch (e) {
                console.log('Auto-bio failed or cancelled');
            }
        }, 500);
    }
}

