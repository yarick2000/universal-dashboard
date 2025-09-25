'use server';
import injector from '@/di';
import { DI } from '@/enums';
import { loggerService } from '@/index';
import { ApiDataClient } from '@/layers/Data';
import { createLogger } from '@/layers/Logging/utils';
import { resolveToken } from '@/utils/di';

import { GoogleRecaptchaVerificationResponseCodes } from '../enums';
import { GoogleRecaptchaVerifyResponse } from '../interfaces';

export async function verifyRecaptchaToken(token: string, expectedAction?: string) {
  const logger = createLogger(loggerService, import.meta.url);
  const apiClient = resolveToken<ApiDataClient>(injector, DI.LocalApiDataClient);
  const secret = process.env.GOOGLE_RECAPTCHA_SECRET;
  if (!secret) {
    await logger.error('GOOGLE_RECAPTCHA_SECRET is not set.');
    return {
      ok: false,
      code: GoogleRecaptchaVerificationResponseCodes.ConfigurationError,
      reason: 'Recaptcha secret not configured',
    };
  }

  const request = {
    event: {
      token,
      siteKey: process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY as string,
      expectedAction: expectedAction || 'general',
    },
  };
  const params = new URLSearchParams();
  params.append('key', process.env.GOOGLE_API_KEY as string);
  try {
    const data = await apiClient.post<GoogleRecaptchaVerifyResponse, typeof request>(
      `${process.env.GOOGLE_RECAPTCHA_API_URL as string}?${params.toString()}`,
      request,
    );

    if (!data.success) {
      await logger.warn('Recaptcha verification failed: invalid response', { data });
      return {
        success: false,
        code: GoogleRecaptchaVerificationResponseCodes.InvalidResponse,
        reason: 'Invalid API response',
      };
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      await logger.warn('Recaptcha verification failed: unexpected action', { data });
      return {
        success: false,
        code: GoogleRecaptchaVerificationResponseCodes.UnexpectedAction,
        reason: `Unexpected action: ${data.action}`,
      };
    }

    // Optional score threshold (e.g., 0.5)
    const minScore = parseFloat(process.env.GOOGLE_RECAPTCHA_MIN_SCORE as string);
    if (typeof data.score === 'number' && data.score < minScore) {
      await logger.warn('Recaptcha verification failed: low score', { data });
      return {
        success: false,
        code: GoogleRecaptchaVerificationResponseCodes.LowScore,
        reason: `Low score: ${data.score}`,
      };
    }
    await logger.debug('Recaptcha verification passed successfully', { data });
    return { success: true, score: data.score };
  } catch (error) {
    await logger.error('Error verifying recaptcha token', { error });
    return {
      success: false,
      code: GoogleRecaptchaVerificationResponseCodes.VerificationError,
      reason: 'Error verifying recaptcha',
    };
  }
}
