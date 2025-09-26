import { buildUrl } from '@/utils/url';

import { ApiDataClient } from '../interfaces';
import { ApiDataClientOptions } from '../types';

/**
 * Creates a remote API data client with HTTP methods for making API requests.
 *
 * @returns An object containing HTTP method functions (get, post, delete, put) for API communication
 *
 * @example
 * ```typescript
 * const client = createRemoteApiDataClient();
 * const user = await client.get<User>('/api/users/1');
 * const newUser = await client.post<User, CreateUserData>('/api/users', userData);
 * await client.delete('/api/users/1');
 * await client.put<User, UpdateUserData>('/api/users/1', updateData);
 * ```
 */
export function createRemoteApiDataClient() {
  return {
    get: async <T>(endpoint: string, options?: ApiDataClientOptions) => {
      const { params, ...fetchOptions } = options || {};
      const response = await fetch(buildUrl(endpoint, params), fetchOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`, { cause: response });
      }
      return (await response.json()) as T;
    },
    post: async <T, P>(endpoint: string, data: P, options?: ApiDataClientOptions) => {
      const { params, ...fetchOptions } = options || {};
      const response = await fetch(buildUrl(endpoint, params), {
        ...fetchOptions,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions?.headers,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Failed to post ${endpoint}: ${response.statusText}`, { cause: response });
      }
      return (await response.json()) as T;
    },
    delete: async <T>(endpoint: string, options?: ApiDataClientOptions) => {
      const { params, ...fetchOptions } = options || {};
      const response = await fetch(buildUrl(endpoint, params), {
        method: 'DELETE',
        ...fetchOptions,
      });
      if (!response.ok) {
        throw new Error(`Failed to delete ${endpoint}: ${response.statusText}`, { cause: response });
      }
      return (await response.json()) as T;
    },
    put: async <T, P>(endpoint: string, data: P, options?: ApiDataClientOptions) => {
      const { params, ...fetchOptions } = options || {};
      const response = await fetch(buildUrl(endpoint, params), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions?.headers,
        },
        body: JSON.stringify(data),
        ...fetchOptions,
      });
      if (!response.ok) {
        throw new Error(`Failed to put ${endpoint}: ${response.statusText}`, { cause: response });
      }
      return (await response.json()) as T;
    },
  } as ApiDataClient;
}

createRemoteApiDataClient.inject = [] as const;
