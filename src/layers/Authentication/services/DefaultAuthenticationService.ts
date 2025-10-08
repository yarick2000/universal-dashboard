import { DI } from '@/enums';
import { isClient } from '@/utils/system';

import { AuthenticationProvider, AuthenticationService } from '../interfaces';

export class DefaultAuthenticationService implements AuthenticationService {
  constructor(
    private readonly authenticationProviderFactory: () => Promise<AuthenticationProvider | null | undefined>,
  ) { }

  async getAuthResult() {
    const authenticationProvider = await this.createProvider();
    if (!authenticationProvider) {
      return {} as unknown as ReturnType<AuthenticationService['getAuthResult']>;
    }
    return authenticationProvider.getAuthResult();
  }

  async getProvidersMap() {
    const authenticationProvider = await this.createProvider();
    if (!authenticationProvider) {
      return [] as unknown as ReturnType<AuthenticationService['getProvidersMap']>;
    }
    return authenticationProvider.getProvidersMap();
  }

  private async createProvider() {
    const provider = await this.authenticationProviderFactory();
    if (!provider && isClient()) {
      throw new Error('AuthenticationProvider is not available on the client side.');
    }
    return provider;
  }

  static inject = [DI.AuthenticationProvider] as const;
}
