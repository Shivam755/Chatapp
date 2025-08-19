const { webcrypto, randomBytes, randomUUID } = require("node:crypto");
// const { subtle, getRandomValues } = webcrypto;

class Encryption {
  /*
   * Generates a new AES-GCM key and IV for encryption.
   * The key is extractable and can be used for both encryption and decryption.
   * @returns {Promise<{key: CryptoKey, iv: Uint8Array}>} - The generated key and IV.
   * The key is a CryptoKey object, and the IV is a Uint8Array.
   */
  generateKey = async () => {
    // Generate an extractable AES-GCM key (256-bit)
    const key = await webcrypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true, // extractable (set false if you don’t need to export)
      ["encrypt", "decrypt"]
    );

    // Fresh IV/nonce per encryption
    const iv = webcrypto.getRandomValues(new Uint8Array(12));

    return { key, iv };
  };

  /*
   * Encrypts data using the provided key and IV.
   * @param {CryptoKey}
   * @param {Uint8Array} iv - The initialization vector for AES-GCM.
   * @param {string} data - The plaintext data to encrypt.
   * @returns {Promise<string>} - The encrypted data as a base64 string.
   * This function uses AES-GCM for encryption.
   * The encrypted data is returned as a base64 string for easy storage and transmission.
   * The key and IV must be provided as CryptoKey and Uint8Array respectively.
   */
  encrypt = async (key, iv, data) => {
    // Encrypt data using AES-GCM
    const encodedData = new TextEncoder().encode(data);
    const encryptedData = await webcrypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encodedData
    );

    return Buffer.from(encryptedData).toString("base64");
  };

  /*
   * Decrypts data using the provided key and IV.
   * @param {CryptoKey} key - The AES-GCM key used for decryption.
   * @param {Uint8Array} iv - The initialization vector used for decryption.
   * @param {string} encryptedData - The encrypted data as a base64 string.
   * @return {Promise<string>} - The decrypted plaintext data.
   * This function uses AES-GCM for decryption.
   * The encrypted data must be provided as a base64 string.
   * The key and IV must be provided as CryptoKey and Uint8Array respectively.
   */
  decrypt = async (key, iv, encryptedData) => {
    // Decrypt data using AES-GCM
    const decodedData = Buffer.from(encryptedData, "base64");
    const decryptedData = await webcrypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      decodedData
    );
    return new TextDecoder().decode(decryptedData);
  };

  /*
   * Converts the key and IV to base64 strings for easy storage.
    * @param {CryptoKey} key - The AES-GCM key to convert.
    * @param {Uint8Array} iv - The initialization vector to convert.
   * @returns {Promise<{keyB64: string, ivB64: string}>
   * - The key and IV as base64 strings.
   * This function is useful for storing the key and IV in a database or sending them over a network.
   * The key is exported as a raw binary format and then converted to base64.
   * The IV is directly converted to base64.
   */
  convertKeyIvToBase64 = async (key, iv) => {
    // Convert key and IV to base64 strings
    const raw = new Uint8Array(await webcrypto.subtle.exportKey("raw", key));
    const keyB64 = Buffer.from(raw).toString("base64");
    const ivB64 = Buffer.from(iv).toString("base64");

    return { keyB64, ivB64 };
  };

  /*
   * Converts base64 strings back to key and IV.
   * @param {string} keyB64 - The base64 string of the key.
   * @param {string} ivB64 - The base64 string of the IV.
   * @return {Promise<{key: CryptoKey, iv: Uint8Array}>}
   * The restored key as a CryptoKey and IV as a Uint8Array.
   * This function is useful for restoring the key and IV from storage.
   * The key is imported from the base64 string and the IV is converted back from base64.
   * The key is imported as a raw binary format suitable for AES-GCM.
   */
  convertKeyIvFromBase64 = async (keyB64, ivB64) => {
    // Convert base64 strings back to key and IV
    const keyBuffer = Buffer.from(keyB64, "base64");
    const ivBuffer = Buffer.from(ivB64, "base64");
    const key = await webcrypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );

    return { key, iv: ivBuffer };
  };

  /**
 * Generate a JWT secret
 * @param {number} [length=32] - length in bytes
 * @returns {string} base64-encoded secret
 */
  generateJwtSecret = (length = 32) => {
    return randomBytes(length).toString("base64");
  }

  generateSessionId = () => {
    return randomUUID();
  }

  getMasterKeyAndIV = async () => {
    const masterKey = process.env.MASTER_KEY;
    const masterIV = process.env.MASTER_IV;

    if (!masterKey || !masterIV) {
      throw new Error("Master key or IV not set in environment variables");
    }

    return await this.convertKeyIvFromBase64(masterKey, masterIV);
  }

  encryptWithMasterKey = async (data) => {
    const { key, iv } = await this.getMasterKeyAndIV();
    return this.encrypt(key, iv, data);
  }

  decryptWithMasterKey = async (encryptedData) => {
    const { key, iv } = await this.getMasterKeyAndIV();
    return this.decrypt(key, iv, encryptedData);
  }
}

module.exports = { Encryption };
