export function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
};
