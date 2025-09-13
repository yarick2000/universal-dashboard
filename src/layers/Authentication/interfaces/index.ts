import { NextAuthResult } from 'next-auth';

/**
 * Interface for Admin Authentication providers.
 */
export interface AuthenticationProvider {
  /**
   * Gets the authentication result.
   * @returns The authentication result.
   */
  getAuthResult(): NextAuthResult;
  /**
   * Gets a map of available authentication providers.
   * @returns An array of objects containing the id and name of each provider.
   */
  getProvidersMap(): { id: string; name: string }[];
}

/**
 * Interface for Admin Authentication services.
 */
export interface AuthenticationService {
  /**
   * Gets the authentication result.
   * @returns The authentication result.
   */
  getAuthResult(): Promise<NextAuthResult>;
  /**
   * Gets a map of available authentication providers.
   * @returns An array of objects containing the id and name of each provider.
   */
  getProvidersMap(): Promise<{ id: string; name: string }[]>;
}
