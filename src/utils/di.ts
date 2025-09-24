import { Injector } from 'typed-inject';

/**
 * Resolves a token from the given injector.
 * @param injector The injector to resolve the token from.
 * @param token The token to resolve.
 * @returns The resolved token.
 */
export function resolveToken<T>(injector: Injector, token: string): T {
  return injector.resolve(token as never) as T;
}
