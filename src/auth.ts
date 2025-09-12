import { authService } from '@/index';

export const { handlers, signIn, signOut, auth } =
  authService.getAuthResult();

export const providersMap = authService.getProvidersMap();
