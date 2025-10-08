import { authService } from '@/index';

export const { handlers, signIn, signOut, auth } = await authService.getAuthResult();
