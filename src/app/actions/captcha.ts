'use server';
import injector from '@/di';
import { loggerService } from '@/index';
import { ApiDataClient } from '@/layers/Data';
import { createLogger } from '@/layers/Logging/utils';
import { resolveToken } from '@/utils';

interface VerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  action?: string;
  'error-codes'?: string[];
}

export async function verifyRecaptchaToken(token: string, expectedAction?: string) {
  const logger = createLogger(loggerService, import.meta.url);
  const apiClient = resolveToken<ApiDataClient>(injector, 'ApiDataClient');
  const secret = process.env.GOOGLE_RECAPTCHA_SECRET;
  if (!secret) {
    await logger.error('GOOGLE_RECAPTCHA_SECRET is not set.');
    return { ok: false, reason: 'Recaptcha secret not configured' };
  }

  const params = new URLSearchParams();
  params.append('secret', secret);
  params.append('response', token);

  try {
    const data = await apiClient.post<VerifyResponse, URLSearchParams>(
      'https://www.google.com/recaptcha/api/siteverify',
      params,
    );

    if (!data.success) {
      return { ok: false, reason: 'Invalid API response' };
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      return { ok: false, reason: `Unexpected action: ${data.action}` };
    }

    // Optional score threshold (e.g., 0.5)
    const minScore = parseFloat(process.env.GOOGLE_RECAPTCHA_MIN_SCORE as string);
    if (typeof data.score === 'number' && data.score < minScore) {
      return { ok: false, reason: `Low score: ${data.score}` };
    }
    return { ok: true, score: data.score };
  } catch (error) {
    await logger.error('Error verifying recaptcha token', { error });
    return { ok: false, reason: 'Error verifying recaptcha' };
  }
}
