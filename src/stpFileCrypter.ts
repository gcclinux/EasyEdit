import CryptoJS from 'crypto-js';

type WordArray = CryptoJS.lib.WordArray;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const uint8ArrayToWordArray = (u8Array: Uint8Array): WordArray => {
  const words: number[] = [];
  for (let i = 0; i < u8Array.length; i += 4) {
    words.push(
      (u8Array[i] << 24) |
        ((u8Array[i + 1] ?? 0) << 16) |
        ((u8Array[i + 2] ?? 0) << 8) |
        (u8Array[i + 3] ?? 0)
    );
  }
  return CryptoJS.lib.WordArray.create(words, u8Array.length);
};

const wordArrayToUint8Array = (wordArray: WordArray): Uint8Array => {
  const { words, sigBytes } = wordArray;
  const u8Array = new Uint8Array(sigBytes);
  let offset = 0;

  for (let i = 0; i < sigBytes; i++) {
    const word = words[i >>> 2];
    const byte = (word >>> (24 - (i % 4) * 8)) & 0xff;
    u8Array[offset++] = byte;
  }

  return u8Array;
};

const normalizeKey = (key: string): WordArray => {
  if (!key) {
    throw new Error('Encryption key is required.');
  }

  const keyBytes = textEncoder.encode(key);

  if (keyBytes.length < 8) {
    throw new Error('Encryption key must be at least 8 bytes long.');
  }

  const normalized = keyBytes.slice(0, 8);
  return uint8ArrayToWordArray(normalized);
};

const createCipherParams = (ciphertext: WordArray): CryptoJS.lib.CipherParams =>
  CryptoJS.lib.CipherParams.create({ ciphertext });

const encryptUint8ArrayInternal = (data: Uint8Array, key: string): WordArray => {
  const keyWordArray = normalizeKey(key);
  const dataWordArray = uint8ArrayToWordArray(data);

  const encrypted = CryptoJS.DES.encrypt(dataWordArray, keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.ciphertext;
};

const decryptToWordArrayInternal = (data: Uint8Array, key: string): WordArray => {
  const keyWordArray = normalizeKey(key);
  const ciphertext = uint8ArrayToWordArray(data);

  const decrypted = CryptoJS.DES.decrypt(createCipherParams(ciphertext), keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted;
};

export const encryptUint8Array = (data: Uint8Array, key: string): Uint8Array =>
  wordArrayToUint8Array(encryptUint8ArrayInternal(data, key));

export const decryptUint8Array = (data: Uint8Array, key: string): Uint8Array =>
  wordArrayToUint8Array(decryptToWordArrayInternal(data, key));

export const encryptTextToBytes = (text: string, key: string): Uint8Array => {
  const inputBytes = textEncoder.encode(text);
  return encryptUint8Array(inputBytes, key);
};

export const decryptBytesToText = (data: Uint8Array, key: string): string => {
  const decryptedBytes = decryptUint8Array(data, key);
  return textDecoder.decode(decryptedBytes);
};
