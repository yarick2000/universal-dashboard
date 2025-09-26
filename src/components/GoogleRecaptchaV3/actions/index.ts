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
  const apiClient = resolveToken<ApiDataClient>(injector, DI.RemoteApiDataClient);
  const secret = process.env.GOOGLE_RECAPTCHA_SECRET;
  if (!secret) {
    await logger.error('GOOGLE_RECAPTCHA_SECRET is not set.');
    return {
      success: false,
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

    // ----- Response Validation (Enterprise & Legacy) -----
    const minScoreEnv = process.env.GOOGLE_RECAPTCHA_MIN_SCORE;
    const minScore = minScoreEnv ? Number(minScoreEnv) : undefined;

    if (!data || typeof data !== 'object') {
      await logger.warn('Recaptcha verification failed: empty or non-object response', { data });
      return {
        success: false,
        code: GoogleRecaptchaVerificationResponseCodes.InvalidResponse,
        reason: 'Empty or malformed API response',
      };
    }

    if (isEnterpriseShape(data)) {
      // ----- Enterprise response shape -----
      return verifyEnterpriseResponse(data, expectedAction, minScore, logger);
      // ----- End Validation -----
    }

    // ----- Legacy (v3) response shape -----
    return verifyLegacyResponse(data, expectedAction, minScore, logger);
    // ----- End Validation -----
  } catch (error) {
    await logger.error('Error verifying recaptcha token', { error });
    return {
      success: false,
      code: GoogleRecaptchaVerificationResponseCodes.VerificationError,
      reason: 'Error verifying recaptcha',
    };
  }
}

// Type guard: detect reCAPTCHA Enterprise verify response shape
function isEnterpriseShape(
  data: unknown,
): data is {
  tokenProperties: {
    valid: boolean; action?: string; invalidReason?: string }; riskAnalysis: { score?: number }
} {
  return !!(
    data &&
    typeof data === 'object' &&
    'tokenProperties' in (data as Record<string, unknown>) &&
    'riskAnalysis' in (data as Record<string, unknown>)
  );
}

// Helper: verify legacy (v3) API response shape
function verifyLegacyResponse(
  data: {
    success: boolean;
    score?: number;
    action?: string;
    'error-codes'?: string[];
  },
  expectedAction: string | undefined,
  minScore: number | undefined,
  logger: ReturnType<typeof createLogger>,
) {
  // Expecting: { success: boolean, score?: number, action?: string, 'error-codes'?: string[] }
  if (data.success !== true) {
    const errors = data['error-codes'];
    void logger.warn('Recaptcha legacy verification failed', { errors, data });
    return {
      success: false,
      code: GoogleRecaptchaVerificationResponseCodes.VerificationError,
      reason: `Verification failed${errors ? `: ${JSON.stringify(errors)}` : ''}`,
    };
  }

  const legacyAction: string | undefined = data.action;
  if (expectedAction && legacyAction && legacyAction !== expectedAction) {
    void logger.warn('Recaptcha legacy action mismatch', { expectedAction, legacyAction });
    return {
      success: false,
      code: GoogleRecaptchaVerificationResponseCodes.UnexpectedAction,
      reason: `Unexpected action: ${legacyAction}`,
    };
  }

  const legacyScore: number | undefined = data.score;
  if (typeof legacyScore === 'number' && typeof minScore === 'number' && legacyScore < minScore) {
    void logger.warn('Recaptcha legacy low score', { legacyScore, minScore });
    return {
      success: false,
      code: GoogleRecaptchaVerificationResponseCodes.LowScore,
      reason: `Low score: ${legacyScore}`,
    };
  }

  void logger.debug('Recaptcha legacy verification passed', {
    score: legacyScore,
    action: legacyAction,
  });
  return { success: true, score: legacyScore, action: legacyAction };
}

// Helper: verify enterprise (reCAPTCHA Enterprise) response
function verifyEnterpriseResponse(
  data: {
    tokenProperties: { valid: boolean; action?: string; invalidReason?: string };
    riskAnalysis: { score?: number };
  },
  expectedAction: string | undefined,
  minScore: number | undefined,
  logger: ReturnType<typeof createLogger>,
) {
  const { tokenProperties, riskAnalysis } = data;

  if (!tokenProperties.valid) {
    const invalidReason = tokenProperties.invalidReason || 'Invalid token';
    void logger.warn('Recaptcha enterprise token invalid', { invalidReason, data });
    return {
      success: false,
      code: GoogleRecaptchaVerificationResponseCodes.VerificationError,
      reason: `Token invalid: ${invalidReason}`,
    };
  }

  if (expectedAction && tokenProperties.action && tokenProperties.action !== expectedAction) {
    void logger.warn('Recaptcha enterprise action mismatch', {
      expectedAction,
      received: tokenProperties.action,
    });
    return {
      success: false,
      code: GoogleRecaptchaVerificationResponseCodes.UnexpectedAction,
      reason: `Unexpected action: ${tokenProperties.action}`,
    };
  }

  if (
    typeof riskAnalysis.score === 'number' &&
    typeof minScore === 'number' &&
    riskAnalysis.score < minScore
  ) {
    void logger.warn('Recaptcha enterprise low score', {
      score: riskAnalysis.score,
      minScore,
    });
    return {
      success: false,
      code: GoogleRecaptchaVerificationResponseCodes.LowScore,
      reason: `Low score: ${riskAnalysis.score}`,
    };
  }

  void logger.debug('Recaptcha enterprise verification passed', {
    score: riskAnalysis.score,
    action: tokenProperties.action,
  });
  return {
    success: true,
    score: riskAnalysis.score,
    action: tokenProperties.action,
  };
}
