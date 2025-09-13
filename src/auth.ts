import { authService } from '@/index';

export const { handlers, signIn, signOut, auth } = await authService.getAuthResult();

export const providersMap = await authService.getProvidersMap();
