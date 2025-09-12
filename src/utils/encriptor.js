import CryptoJS from 'crypto-js';

// Your secret key - make sure this matches ApiPath.secretKey from your Flutter app
const SECRET_KEY = '9cfb46c0b3d5acb8'; // Replace with your actual secret key

/**
 * Encrypts text using AES ECB mode
 * @param {string} text - The text to encrypt
 * @returns {string} - Base64 encoded encrypted text
 */
export const encrypt = (text) => {
  try {
    // Convert key to WordArray
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    
    // Encrypt using AES ECB mode
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Return base64 encoded result
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt text');
  }
};

/**
 * Decrypts base64 encoded text using AES ECB mode
 * @param {string} encryptedText - Base64 encoded encrypted text
 * @returns {string} - Decrypted plain text
 */
export const decrypt = (encryptedText) => {
  try {
    // Convert key to WordArray
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    
    // Decrypt using AES ECB mode
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Convert to UTF8 string
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt text');
  }
};


// Example usage:
// const originalText = {"username":"7821956869","password":"0000","app_key":"com.mirrorinfo"};
// const encrypted = encrypt(JSON.stringify(originalText));
// console.log("Encrypted:", encrypted);
// const decrypted = decrypt(encrypted);
// console.log("Decrypted:", decrypted);