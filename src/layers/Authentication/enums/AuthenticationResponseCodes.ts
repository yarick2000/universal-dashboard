export enum AuthenticationResponseCodes {
  Success = 'Ok',
  InvalidCredentials = 'InvalidCredentials',
  UserNotFound = 'UserNotFound',
  UserDisabled = 'UserDisabled',
  UnknownError = 'UnknownError',
  // Add more error types as needed
}

export enum SignupResponseCodes {
  Success = 'Ok',
  UserAlreadyExists = 'UserAlreadyExists',
  WeakPassword = 'WeakPassword',
  InvalidEmail = 'InvalidEmail',
  UnknownError = 'UnknownError',
  // Add more error types as needed
}
