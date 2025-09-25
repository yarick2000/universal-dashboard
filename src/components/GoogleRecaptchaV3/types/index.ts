import { GoogleRecaptchaVerificationResponseCodes } from '../enums';

export type GoogleRecaptchaVerificationActionResult = {
  success: boolean;
  code: GoogleRecaptchaVerificationResponseCodes;
  score?: number;
  reason?: string;
};
