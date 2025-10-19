import { AuthenticationResponseCodes } from '../enums/AuthenticationResponseCodes';

export type AuthenticationActionResult = {
  success: boolean;
  code: AuthenticationResponseCodes
};

