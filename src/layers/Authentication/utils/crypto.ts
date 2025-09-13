import { pbkdf2Sync } from 'crypto';

const ITERATIONS = 100_000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';

/**
 * Derives a hash from the provided password using a global salt from AUTH_SALT.
 * Returns a versioned hash string: pbkdf2$<iterations>$<digest>$<hexHash>
 */
export function saltAndHashPassword(password: string): string {
  if (!password) throw new Error('Password must be provided.');
  const salt = process.env.AUTH_SALT;
  if (!salt) throw new Error('AUTH_SALT environment variable is not set.');

  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `pbkdf2$${ITERATIONS}$${DIGEST}$${hash}`;
}

/**
 * Verifies a password against a stored hash.
 * The stored hash must be in the format: pbkdf2$<iterations>$<digest>$<hexHash>
 */
export function verifyPassword(password?: string, storedHash?: string | null): boolean {
  if (!password || !storedHash) return false; // Invalid input

  const parts = storedHash.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false; // Unsupported format or invalid format

  const iterations = parseInt(parts[1], 10);
  const digest = parts[2];
  const hash = parts[3];

  const salt = process.env.AUTH_SALT;
  if (!salt) return false;

  const computedHash = pbkdf2Sync(
    password,
    salt,
    iterations,
    KEY_LENGTH,
    digest,
  ).toString('hex');
  return computedHash === hash;
}
