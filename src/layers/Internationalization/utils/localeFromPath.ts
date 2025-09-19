export function localeFromPath(path: string, locales: string[]): string | null {
  const locale = path.split('/')[1];
  return locales.includes(locale) ? locale : null;
}
