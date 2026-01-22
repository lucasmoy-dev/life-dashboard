/**
 * Auth Service - Handles vault unlocking and biometric authentication.
 * Adapted from private-notes.
 */
import { SecurityService } from './SecurityService.js';

const KEYS = {
    MASTER_HASH: 'db_master_hash',
    VAULT_KEY: 'db_vault_key',
    BIO_ENABLED: 'db_bio_enabled'
};

export class AuthService {
    /**
     * Checks if a master password has been set up
     */
    static isSetup() {
        return !!localStorage.getItem(KEYS.MASTER_HASH);
    }

    /**
     * Sets up the initial master password
     */
    static async setup(password) {
        const hash = await SecurityService.hash(password);
        const vaultKey = await SecurityService.deriveVaultKey(password);
        localStorage.setItem(KEYS.MASTER_HASH, hash);
        // We only store the vaultKey locally if biometrics or "remember me" is enabled
        // For security, by default it's only in sessionStorage
        sessionStorage.setItem(KEYS.VAULT_KEY, vaultKey);
        return vaultKey;
    }

    /**
     * Attempts to unlock the vault with a password
     */
    static async unlock(password) {
        const hash = await SecurityService.hash(password);
        const savedHash = localStorage.getItem(KEYS.MASTER_HASH);

        if (hash === savedHash) {
            const vaultKey = await SecurityService.deriveVaultKey(password);
            sessionStorage.setItem(KEYS.VAULT_KEY, vaultKey);
            return vaultKey;
        }
        throw new Error('Contraseña incorrecta');
    }

    /**
     * Biometric: Register Fingerprint
     */
    static async registerBiometrics(password) {
        // Need to verify password first
        await this.unlock(password);
        const vaultKey = sessionStorage.getItem(KEYS.VAULT_KEY);

        if (!window.PublicKeyCredential) {
            throw new Error('Biometría no soportada en este dispositivo');
        }

        try {
            const challenge = crypto.getRandomValues(new Uint8Array(32));
            await navigator.credentials.create({
                publicKey: {
                    challenge,
                    rp: { name: 'Life Dashboard', id: window.location.hostname },
                    user: {
                        id: crypto.getRandomValues(new Uint8Array(16)),
                        name: "user",
                        displayName: "User"
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                    timeout: 60000,
                    authenticatorSelection: { authenticatorAttachment: "platform" },
                    attestation: "none"
                }
            });

            localStorage.setItem(KEYS.BIO_ENABLED, 'true');
            // Store vaultKey locally (encrypted by device biosystem ideally, but here persistent for recovery)
            localStorage.setItem(KEYS.VAULT_KEY, vaultKey);
            return true;
        } catch (e) {
            console.error('Biometric setup failed:', e);
            throw new Error('Error al configurar biometría');
        }
    }

    /**
     * Biometric: Unlock with Fingerprint
     */
    static async unlockWithBiometrics() {
        const isEnabled = localStorage.getItem(KEYS.BIO_ENABLED) === 'true';
        if (!isEnabled) throw new Error('Biometría no activada');

        try {
            const challenge = crypto.getRandomValues(new Uint8Array(32));
            await navigator.credentials.get({
                publicKey: {
                    challenge,
                    rpId: window.location.hostname,
                    userVerification: "required",
                    timeout: 60000
                }
            });

            const vaultKey = localStorage.getItem(KEYS.VAULT_KEY);
            if (vaultKey) {
                sessionStorage.setItem(KEYS.VAULT_KEY, vaultKey);
                return vaultKey;
            }
            throw new Error('Llave no encontrada. Usa contraseña.');
        } catch (e) {
            console.error('Biometric auth failed:', e);
            throw new Error('Fallo de identificación biométrica');
        }
    }

    static logout() {
        sessionStorage.removeItem(KEYS.VAULT_KEY);
    }

    static getVaultKey() {
        return sessionStorage.getItem(KEYS.VAULT_KEY);
    }

    static isBioEnabled() {
        return localStorage.getItem(KEYS.BIO_ENABLED) === 'true';
    }
}
