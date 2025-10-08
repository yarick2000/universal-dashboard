import { AuthenticationResponseCodes, SignupResponseCodes } from '../enums/AuthenticationResponseCodes';

export type AuthenticationActionResult = {
  success: boolean;
  code: AuthenticationResponseCodes
};

export type SignupActionResult = {
  success: boolean;
  code: SignupResponseCodes
};
