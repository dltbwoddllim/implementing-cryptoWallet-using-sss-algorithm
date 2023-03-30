export class encryptItem {
    constructor() {
        this.salt = crypto.getRandomValues(new Uint8Array(16));
        this.password = "";
        this.ciphertext = "";
        this.iv = crypto.getRandomValues(new Uint8Array(12));
    }

    setPassword(pw){
        this.password = pw;
        return this.password;
    }

    getMessageEncoding(point) {
        let enc = new TextEncoder();
        return enc.encode(point);
    }

    getKeyMaterial() {
        let enc = new TextEncoder();
        return crypto.subtle.importKey(
            "raw",
            enc.encode(this.password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );
    }


    getKey(keyMaterial) {
        return crypto.subtle.deriveKey(
            {
                "name": "PBKDF2",
                salt: this.salt,
                "iterations": 100000,
                "hash": "SHA-256"
            },
            keyMaterial,
            { "name": "AES-GCM", "length": 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }

    async encrypt(point) {
        let keyMaterial = await this.getKeyMaterial(this.password);
        let key = await this.getKey(keyMaterial, this.salt);
        let encoded = this.getMessageEncoding(point);
        this.ciphertext = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: this.iv
            },
            key,
            encoded
        );

        return this.ciphertext
    }

    async decrypt(encryptedPoint) {
        let keyMaterial = await this.getKeyMaterial();
        let key = await this.getKey(keyMaterial, this.salt);

        try {
            let decrypted = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: this.iv
                },
                key,
                encryptedPoint
            );
            let dec = new TextDecoder();
            return dec.decode(decrypted)
        } catch (e) {
            console.log(e)
        }
    }
}