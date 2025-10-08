'use server';
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import { loggerService } from '@/index';
import {
  AuthenticationActionResult,
  AuthenticationResponseCodes,
  SignupActionResult,
  SignupResponseCodes,
} from '@/layers/Authentication';
import { createLogger } from '@/layers/Logging/utils';

export async function signInAction(): Promise<void> {
  await signIn();
}

export async function signUpAction(
  email: string,
  firstName: string,
  lastName: string,
  password: string,
): Promise<SignupActionResult> {
  const logger = createLogger(loggerService, import.meta.url);
  try {
    // Proceed with signup
    return { success: true, code: SignupResponseCodes.Success };
  } catch (error) {
    await logger.error('Error checking if account exists:', error);
    return { success: false, code: SignupResponseCodes.UnknownError };
  }
}

export async function authenticateAction(
  email: string,
  password: string,
): Promise<AuthenticationActionResult> {
  const logger = createLogger(loggerService, import.meta.url);
  try {
    await signIn('credentials', { email, password, redirect: false });
    return { success: true, code: AuthenticationResponseCodes.Success };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'EmailSignInError':
          await logger.warn(`Invalid credentials provided during sign-in for ${email}.`, error);
          return {
            success: false,
            code: AuthenticationResponseCodes.UserNotFound,
          };
        case 'CredentialsSignin':
          await logger.warn(`Invalid credentials provided during sign-in for ${email}.`, error);
          return {
            success: false,
            code: AuthenticationResponseCodes.InvalidCredentials,
          };
        default:
          await logger.error(`Authentication error of type ${error.type} for ${email}.`, error);
          return {
            success: false,
            code: AuthenticationResponseCodes.UnknownError,
          };
      }
    }
    await logger.error(`Unknown error during authentication for ${email}.`, error);
    return { success: false, code: AuthenticationResponseCodes.UnknownError };
  }
}
