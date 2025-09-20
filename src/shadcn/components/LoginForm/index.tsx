import { useCallback, useRef } from 'react';

import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { cn } from '../../utils';

export type LoginFormProps = React.ComponentProps<'div'> & {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  forgotPasswordText: string;
  signUpText: string;
  signUpPrompt?: string;
  loginButtonText: string;
  cancelButtonText: string;
  signupLink?: string;
  forgotPasswordLink?: string;
  errorMessage?: string;
  passwordErrorMessage?: string;
  emailErrorMessage?: string;
  onLogin?: (email: string, password: string) => void;
  onCancel?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
};

export function LoginForm({
  className,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  forgotPasswordText,
  signUpText,
  signUpPrompt,
  loginButtonText,
  cancelButtonText,
  signupLink,
  forgotPasswordLink,
  onLogin,
  onCancel,
  onForgotPassword,
  onSignUp,
  ...props
}: LoginFormProps) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value as string;
    const password = passwordRef.current?.value as string;
    if (onLogin) {
      onLogin(email, password);
    }
  }, [onLogin]);
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={onSubmit} data-element-form>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email" data-element-email-label>{emailLabel}</Label>
            <Input
              ref={emailRef}
              id="email"
              type="email"
              placeholder={emailPlaceholder}
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
              ref={passwordRef}
              id="password"
              type="password"
              placeholder={passwordPlaceholder}
              required
              data-element-password-input
            />
          </div>
          <div className="flex flex-row gap-3">
            <Button type="submit" className="w-full" data-element-login-button>
              {loginButtonText}
            </Button>
            <Button onClick={onCancel} variant="outline" className="w-full" data-element-cancel-button>
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
