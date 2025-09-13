import { DI } from '@/enums';
import { isClient } from '@/utils';

import { AuthenticationProvider, AuthenticationService } from '../interfaces';

export class DefaultAuthenticationService implements AuthenticationService {
  constructor(
    private readonly authenticationProviderFactory: () => Promise<AuthenticationProvider | null | undefined>,
  ) { }

  async getAuthResult() {
    const authenticationProvider = await this.authenticationProviderFactory();
    if (!authenticationProvider && isClient()) {
      throw new Error('AuthenticationProvider is not available on the client side.');
    }
    if (!authenticationProvider) {
      return {} as unknown as ReturnType<AuthenticationService['getAuthResult']>;
    }
    return authenticationProvider.getAuthResult();
  }

  async getProvidersMap() {
    const authenticationProvider = await this.authenticationProviderFactory();
    if (!authenticationProvider && isClient()) {
      throw new Error('AuthenticationProvider is not available on the client side.');
    }
    if (!authenticationProvider) {
      return [] as unknown as ReturnType<AuthenticationService['getProvidersMap']>;
    }
    return authenticationProvider.getProvidersMap();
  }

  static inject = [DI.AuthenticationProvider] as const;
}
