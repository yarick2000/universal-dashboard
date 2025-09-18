export function localeFromPath(path: string): string | null {
  const locale = path.split('/')[1];
  return locale || null;
}
