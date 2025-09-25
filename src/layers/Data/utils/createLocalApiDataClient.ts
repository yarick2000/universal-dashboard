import { isServer } from '@/utils/system';

import { ApiDataClient } from '../interfaces';

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
