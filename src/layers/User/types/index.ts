import { SignupResponseCodes } from '../enums';

export type SignupActionResult = {
  success: boolean;
  code: SignupResponseCodes
};
