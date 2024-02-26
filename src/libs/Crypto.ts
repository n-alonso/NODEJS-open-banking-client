import crypto from "crypto";
import CONSTANTS from "../config/CONSTANTS";
const { CRYPTO_PASSWORD, SALT, ENCRYPTION_METHOD } = CONSTANTS;
const { createCipheriv, scryptSync, createDecipheriv } = crypto;

export class Crypto {
    private readonly key: Buffer;

    public constructor() {
        this.key = scryptSync(CRYPTO_PASSWORD as string, SALT as string, 24);
    }

    public encrypt(text: string): string {
        const iv = Buffer.alloc(16, 0);
        const cipher = createCipheriv(ENCRYPTION_METHOD as string, this.key, iv);

        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");

        return encrypted;
    }

    public decrypt(cipher: string): string {
        const iv = Buffer.alloc(16, 0);
        const decipher = createDecipheriv(ENCRYPTION_METHOD as string, this.key, iv);

        let decrypted = decipher.update(cipher, "hex", "utf-8");
        decrypted += decipher.final("utf-8");

        return decrypted;
    }
}
