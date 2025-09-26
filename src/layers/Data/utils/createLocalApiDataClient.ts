import { isServer } from '@/utils/system';

import { ApiDataClient } from '../interfaces';

/**
 * Creates a local API data client for making HTTP requests to the application's API endpoints.
 *
 * This function returns a REST API client that provides methods for GET, POST, PUT, and DELETE
 * operations. The client is only available on the client side - it returns null when called
 * on the server side.
 *
 * @returns {ApiDataClient | null} A REST API client with HTTP methods, or null if called on server side
 *
 * @example
 * ```typescript
 * const client = createLocalApiDataClient();
 * if (client) {
 *   const data = await client.get<User>('users/123');
 *   await client.post<User, CreateUserData>('users', { name: 'John' });
 * }
 * ```
 *
 * @throws {Error} Throws an error if any HTTP request fails (non-2xx status codes)
 */
export function createLocalApiDataClient() {
  // No localREST API client on the server side
  if (isServer()) {
    return null;
  }
  // returns a simple REST API client
  return {
    get: async <T>(endpoint: string) => {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`, { cause: response });
      }
      return await response.json() as T;
    },
    post: async <T, P>(endpoint: string, data: P) => {
      const response = await fetch(`/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Failed to post ${endpoint}: ${response.statusText}`, { cause: response });
      }
      return await response.json() as T;
    },
    put: async <T, P>(endpoint: string, data: P) => {
      const response = await fetch(`/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Failed to put ${endpoint}: ${response.statusText}`, { cause: response });
      }
      return await response.json() as T;
    },
    delete: async <T>(endpoint: string) => {
      const response = await fetch(`/${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete ${endpoint}: ${response.statusText}`, { cause: response });
      }
      return await response.json() as T;
    },
  } as ApiDataClient;
}

createLocalApiDataClient.inject = [] as const;
