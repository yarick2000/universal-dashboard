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
  showCaptchaUI?: boolean;
  cancelButtonText?: string;
  isSigningUp?: boolean;
  formRef?: React.RefObject<HTMLFormElement | null>;
  onFormSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onSignup?: (data: FormData) => Promise<void>;
  onFirstNameChange?: (value: string) => void;
  onLastNameChange?: (value: string) => void;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
  onCancel?: () => void;
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
  showCaptchaUI,
  cancelButtonText,
  isSigningUp,
  formRef,
  onFormSubmit,
  onSignup,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onCancel,
  ...props
}: SignupFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {/* General error message */}
      {generalError && (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          data-element-general-error-message
        >
          {generalError}
        </div>
      )}
      <form ref={formRef} onSubmit={onFormSubmit} action={onSignup} className="space-y-4" data-element-form>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{firstNameLabel}</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder={firstNamePlaceholder}
              value={firstName}
              onChange={(e) => onFirstNameChange?.(e.target.value)}
              className={firstNameError ? 'border-red-500' : ''}
              disabled={isSigningUp}
              required
              data-element-first-name-input
            />
            {firstNameError && <p className="text-sm text-red-500">{firstNameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">{lastNameLabel}</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder={lastNamePlaceholder}
              value={lastName}
              onChange={(e) => onLastNameChange?.(e.target.value)}
              className={lastNameError ? 'border-red-500' : ''}
              disabled={isSigningUp}
              required
              data-element-last-name-input
            />
            {lastNameError && <p className="text-sm text-red-500">{lastNameError}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{emailLabel}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={(e) => onEmailChange?.(e.target.value)}
            className={emailError ? 'border-red-500' : ''}
            disabled={isSigningUp}
            required
            data-element-email-input
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{passwordLabel}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={passwordPlaceholder}
            value={password}
            onChange={(e) => onPasswordChange?.(e.target.value)}
            className={passwordError ? 'border-red-500' : ''}
            disabled={isSigningUp}
            required
            data-element-password-input
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{confirmPasswordLabel}</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder={confirmPasswordPlaceholder}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
            className={confirmPasswordError ? 'border-red-500' : ''}
            disabled={isSigningUp}
            required
            data-element-confirm-password-input
          />
          {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
        </div>

        {/* Captcha placeholder */}
        {captchaComponent && (<>
          {!showCaptchaUI && captchaComponent}
          {showCaptchaUI && (
            <div className="space-y-2">
              <Label>{verificationLabel}</Label>
              <div className="rounded-md border-2 border-dashed border-gray-300 p-8 text-center
                text-gray-500">
                {captchaComponent}
              </div>
            </div>
          )}
        </>)}

        <Button type="submit" className="w-full" disabled={isSigningUp} data-element-create-account-button>
          {createAccountButtonText}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="w-full"
          data-element-cancel-button
        >
          {cancelButtonText}
        </Button>
      </form>
    </div >
  );
}
