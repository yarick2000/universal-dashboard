import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { cn } from '../../utils';

export type LoginFormProps = React.ComponentProps<'div'> & {
  emailLabel: string;
  emailPlaceholder: string;
  emailValue?: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordValue?: string;
  forgotPasswordText: string;
  signUpText: string;
  signUpPrompt?: string;
  loginButtonText: string;
  cancelButtonText: string;
  signupLink?: string;
  forgotPasswordLink?: string;
  errorMessage?: string;
  isLoggingIn?: boolean;
  onLogin?: (data: FormData) => Promise<void>;
  onFormSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
};

export function LoginForm({
  className,
  emailLabel,
  emailPlaceholder,
  emailValue,
  passwordLabel,
  passwordPlaceholder,
  passwordValue,
  errorMessage,
  forgotPasswordText,
  signUpText,
  signUpPrompt,
  loginButtonText,
  cancelButtonText,
  signupLink,
  forgotPasswordLink,
  isLoggingIn,
  onFormSubmit,
  onLogin,
  onCancel,
  onForgotPassword,
  onSignUp,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {errorMessage && (
        <div className="pb-2" data-element-error-message-container>
          <p
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
            data-element-error-message
          >
            {errorMessage}
          </p>
        </div>
      )}
      <form onSubmit={onFormSubmit} action={onLogin} data-element-form>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email" data-element-email-label>{emailLabel}</Label>
            <Input
              name="email"
              type="email"
              placeholder={emailPlaceholder}
              disabled={isLoggingIn}
              defaultValue={emailValue}
              required
              data-element-email-input
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password" data-element-password-label>{passwordLabel}</Label>
              <a
                href={forgotPasswordLink}
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                onClick={onForgotPassword}
                data-element-forgot-password-link
              >
                {forgotPasswordText}
              </a>
            </div>
            <Input
              name="password"
              type="password"
              placeholder={passwordPlaceholder}
              disabled={isLoggingIn}
              defaultValue={passwordValue}
              required
              data-element-password-input
            />
            {/* {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>} */}
          </div>
          <div className="flex flex-row gap-3">
            <Button type="submit" className="w-full" disabled={isLoggingIn} data-element-login-button>
              {loginButtonText}
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
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          <span data-element-signup-prompt>{signUpPrompt}</span>
          {signUpPrompt && ' '}
          <a
            href={signupLink}
            onClick={onSignUp}
            className="underline underline-offset-4"
            data-element-signup-link
          >
            {signUpText}
          </a>
        </div>
      </form>
    </div>
  );
}
