export function isClient(): boolean {
  return typeof window !== 'undefined';
};

export function isServer(): boolean {
  return (
    typeof window === 'undefined' &&
    (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge')
  );
};
