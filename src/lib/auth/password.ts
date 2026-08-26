/**
 * Edge-compatible password hashing using standard WebCrypto API (PBKDF2-HMAC-SHA256).
 * Safe for Cloudflare Workers, OpenNext, V8 Isolates, Node.js, and browser environments.
 */

const ITERATIONS = 100_000;
const KEY_LEN = 32; // 256 bits
const ALGORITHM = "SHA-256";

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Hashes a plain-text password using PBKDF2 with a randomly generated salt.
 * Returns a formatted string: `<salt_hex>:<hash_hex>`
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: ALGORITHM,
    },
    baseKey,
    KEY_LEN * 8
  );

  const saltHex = bufferToHex(salt.buffer);
  const hashHex = bufferToHex(derivedBits);

  return `${saltHex}:${hashHex}`;
}

/**
 * Verifies a plain-text password against a stored `<salt_hex>:<hash_hex>` hash string.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;

  const [saltHex, originalHashHex] = parts;
  const salt = hexToBuffer(saltHex);
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: ALGORITHM,
    },
    baseKey,
    KEY_LEN * 8
  );

  const derivedHashHex = bufferToHex(derivedBits);

  // Constant-time string comparison to prevent timing attacks
  if (derivedHashHex.length !== originalHashHex.length) return false;

  let result = 0;
  for (let i = 0; i < derivedHashHex.length; i++) {
    result |= derivedHashHex.charCodeAt(i) ^ originalHashHex.charCodeAt(i);
  }

  return result === 0;
}
