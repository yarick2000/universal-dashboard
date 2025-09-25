/**
 * Executes an async function with automatic retry logic on failure.
 *
 * @template T - The return type of the async function
 * @param fn - The async function to execute with retry logic
 * @param retries - The number of retry attempts (default: 2)
 * @param delay - The delay in milliseconds between retry attempts (default: 0)
 * @returns A Promise that resolves with the result of the function or rejects after all retries are exhausted
 * @throws The last error encountered if all retry attempts fail
 *
 * @example
 * ```typescript
 * const result = await retryAsync(
 *   () => fetch('/api/data').then(res => res.json()),
 *   3,
 *   1000
 * );
 * ```
 */
export function retryAsync<T>(fn: () => Promise<T>, retries = 2, delay = 0): Promise<T> {
  return new Promise((resolve, reject) => {
    const attempt = (n: number) => {
      fn()
        .then(resolve)
        .catch((error) => {
          if (n === 1) {
            reject(error instanceof Error ? error : new Error(String(error)));
          } else {
            setTimeout(() => attempt(n - 1), delay);
          }
        });
    };
    attempt(retries);
  });
}
