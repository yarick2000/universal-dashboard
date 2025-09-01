export function fileURLToPath(url: URL) {
  if (typeof url !== 'string' && !(url instanceof URL)) {
    throw new TypeError('The "url" argument must be of type string or an instance of URL.');
  }

  const pathname = new URL(url).pathname;

  // Decode the pathname to handle special characters
  const decodedPath = decodeURIComponent(pathname);

  if (process.platform === 'win32') {
    // On Windows, remove the leading slash for absolute paths
    return decodedPath.slice(1).replace(/\//g, '\\');
  }

  return decodedPath;
}

// utils/path-lite.ts
/**
 * Edge/Browser-safe basename polyfill.
 * - Works with POSIX & Windows paths and absolute URLs (http/https/file).
 * - Optionally strips a matching extension (like Node's path.basename(path, ext)).
 */
export function baseName(input: string, ext?: string): string {
  if (!input) return '';

  // Prefer URL parsing only for absolute URLs (avoids "C:\..." being treated as a URL)
  const isAbsoluteUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(input);

  let name: string | undefined;

  if (isAbsoluteUrl) {
    try {
      const u = new URL(input);
      // Example: "file:///C:/dir/file.ts" -> pathname "/C:/dir/file.ts"
      const last = u.pathname.split('/').filter(Boolean).pop() ?? '';
      name = safeDecode(last);
    } catch {
      // fall through to path-like handling
    }
  }

  if (name === undefined) {
    // Treat as a plain path (supports Windows and POSIX)
    const normalized = input.replace(/\\/g, '/').replace(/\/+$/g, '');
    const parts = normalized.split('/');
    name = parts[parts.length - 1] || '';
  }

  if (ext) {
    const extNorm = ext.startsWith('.') ? ext : `.${ext}`;
    // Match case-insensitively to be friendlier across platforms/bundlers.
    if (name.toLowerCase().endsWith(extNorm.toLowerCase())) {
      name = name.slice(0, -extNorm.length);
    }
  }

  return name;
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
