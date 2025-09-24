import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { cn } from '../../utils';

type SignupFormProps = React.ComponentProps<'div'> & {
  generalError?: string;
  firstName?: string;
  firstNameLabel?: string;
  firstNamePlaceholder?: string;
  firstNameError?: string;
  lastName?: string;
  lastNameLabel?: string;
  lastNamePlaceholder?: string;
  lastNameError?: string;
  email?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  emailError?: string;
  password?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  passwordError?: string;
  confirmPassword?: string;
  confirmPasswordError?: string;
  confirmPasswordLabel?: string;
  confirmPasswordPlaceholder?: string;
  createAccountButtonText?: string;
  verificationLabel?: string;
  captchaComponent?: React.ReactNode;
  onFormSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onFirstNameChange?: (value: string) => void;
  onLastNameChange?: (value: string) => void;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
};

export function SignupForm({
  generalError,
  className,
  firstName,
  firstNameLabel,
  firstNamePlaceholder,
  firstNameError,
  lastName,
  lastNameLabel,
  lastNamePlaceholder,
  lastNameError,
  email,
  emailLabel,
  emailPlaceholder,
  emailError,
  password,
  passwordLabel,
  passwordPlaceholder,
  passwordError,
  confirmPassword,
  confirmPasswordError,
  confirmPasswordLabel,
  confirmPasswordPlaceholder,
  createAccountButtonText,
  verificationLabel,
  captchaComponent,
  onFormSubmit,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  ...props
}: SignupFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {/* General error message */}
      {generalError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {generalError}
        </div>
      )}
      <form onSubmit={onFormSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{firstNameLabel}</Label>
            <Input
              name="firstName"
              type="text"
              placeholder={firstNamePlaceholder}
              value={firstName}
              onChange={(e) => onFirstNameChange?.(e.target.value)}
              className={firstNameError ? 'border-red-500' : ''}
            />
            {firstNameError && <p className="text-sm text-red-500">{firstNameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">{lastNameLabel}</Label>
            <Input
              name="lastName"
              type="text"
              placeholder={lastNamePlaceholder}
              value={lastName}
              onChange={(e) => onLastNameChange?.(e.target.value)}
              className={lastNameError ? 'border-red-500' : ''}
            />
            {lastNameError && <p className="text-sm text-red-500">{lastNameError}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{emailLabel}</Label>
          <Input
            name="email"
            type="email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={(e) => onEmailChange?.(e.target.value)}
            className={emailError ? 'border-red-500' : ''}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{passwordLabel}</Label>
          <Input
            name="password"
            type="password"
            placeholder={passwordPlaceholder}
            value={password}
            onChange={(e) => onPasswordChange?.(e.target.value)}
            className={passwordError ? 'border-red-500' : ''}
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{confirmPasswordLabel}</Label>
          <Input
            name="confirmPassword"
            type="password"
            placeholder={confirmPasswordPlaceholder}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
            className={confirmPasswordError ? 'border-red-500' : ''}
          />
          {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
        </div>

        {/* Captcha placeholder */}
        {captchaComponent && (
          <div className="space-y-2">
            <Label>{verificationLabel}</Label>
            <div className="rounded-md border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
              {captchaComponent}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full">
          {createAccountButtonText}
        </Button>
      </form>
    </div >
  );
}
