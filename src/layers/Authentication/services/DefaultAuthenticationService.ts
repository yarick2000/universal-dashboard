import { DI } from '@/enums';
import { isClient } from '@/utils';

import { AuthenticationProvider, AuthenticationService } from '../interfaces';

export class DefaultAuthenticationService implements AuthenticationService {
  constructor(
    private readonly authenticationProvider: AuthenticationProvider | null,
  ) { }

  getAuthResult() {
    if (!this.authenticationProvider && isClient()) {
      throw new Error('AuthenticationProvider is not available on the client side.');
    }
    if (!this.authenticationProvider) {
      throw new Error('AuthenticationProvider is not initialized.');
    }
    return this.authenticationProvider.getAuthResult();
  }

  getProvidersMap() {
    if (!this.authenticationProvider && isClient()) {
      throw new Error('AuthenticationProvider is not available on the client side.');
    }
    if (!this.authenticationProvider) {
      throw new Error('AuthenticationProvider is not initialized.');
    }
    return this.authenticationProvider.getProvidersMap();
  }

  static inject = [DI.AuthenticationProvider] as const;
}
