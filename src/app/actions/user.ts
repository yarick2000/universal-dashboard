'use server';
import { AuthError } from '@supabase/supabase-js';

import { loggerService, userService } from '@/index';
import { createLogger } from '@/layers/Logging/utils';
import {
  SignupActionResult,
  SignupResponseCodes,
} from '@/layers/User';

export async function signUpAction(
  email: string,
  firstName: string,
  lastName: string,
  password: string,
): Promise<SignupActionResult> {
  const logger = createLogger(loggerService, import.meta.url);
  try {
    // Proceed with signup
    await userService.signupUser(email, firstName, lastName, password);
    await logger.info(`User signed up successfully: ${email}`);
    return { success: true, code: SignupResponseCodes.Success };
  } catch (error) {
    await logger.error('Error during signup:', error);
    if (error instanceof AuthError) {
      if (error.code === 'email_address_invalid') {
        return { success: false, code: SignupResponseCodes.InvalidEmail };
      } else if (error.code === 'user_already_registered') {
        return { success: false, code: SignupResponseCodes.UserAlreadyExists };
      } else if (error.code === 'weak_password') {
        return { success: false, code: SignupResponseCodes.WeakPassword };
      }
    }
    return { success: false, code: SignupResponseCodes.UnknownError };
  }
}
