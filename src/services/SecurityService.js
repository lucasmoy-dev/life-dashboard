/**
 * Security Service - Centralized module for all encryption, decryption, and hashing.
 * Imported and adapted from private-notes.
 */

export class SecurityService {
    /**
     * Hashes a password using SHA-512
     */
    static async hash(text, salt = 'salt_life_dashboard_2026') {
        const encoder = new TextEncoder();
        const data = encoder.encode(text + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-512', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Derives a vault key from a password to avoid storing the plain text password.
     */
    static async deriveVaultKey(password) {
        return await this.hash(password, 'vault_v4_dashboard_key');
    }

    /**
     * Derives a cryptographic key from a password
     */
    static async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const passwordKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        return await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 250000,
                hash: 'SHA-512'
            },
            passwordKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Encrypts any data object using AES-256-GCM
     */
    static async encrypt(data, password) {
        try {
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const key = await this.deriveKey(password, this.bufToBase64(salt));

            const payload = typeof data === 'string' ? data : JSON.stringify(data);
            const encodedPayload = new TextEncoder().encode(payload);

            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                key,
                encodedPayload
            );

            return {
                payload: this.bufToBase64(new Uint8Array(encrypted)),
                iv: this.bufToBase64(iv),
                salt: this.bufToBase64(salt),
                v: '5.0'
            };
        } catch (e) {
            console.error('[Security] Encryption failed:', e);
            throw new Error('No se pudo encriptar la información');
        }
    }

    /**
     * Decrypts an encrypted object back to its original form
     */
    static async decrypt(encryptedObj, password) {
        try {
            if (!encryptedObj || !encryptedObj.payload || !encryptedObj.iv || !encryptedObj.salt) {
                throw new Error('Formato de datos encriptados inválido');
            }

            const { payload, iv, salt } = encryptedObj;
            const key = await this.deriveKey(password, salt);

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: this.base64ToBuf(iv) },
                key,
                this.base64ToBuf(payload)
            );

            const finalData = new TextDecoder().decode(decrypted);

            try {
                return JSON.parse(finalData);
            } catch {
                return finalData;
            }
        } catch (e) {
            console.error('[Security] Decryption failed:', e);
            throw new Error('Contraseña incorrecta o datos corruptos');
        }
    }

    static bufToBase64(buffer) {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    }

    static base64ToBuf(base64) {
        return new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
    }
}
