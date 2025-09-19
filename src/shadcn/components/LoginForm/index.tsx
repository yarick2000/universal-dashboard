import { Button } from '../../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { cn } from '../../utils';

export type LoginFormProps = React.ComponentProps<'div'> & {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  forgotPasswordText: string;
  signUpText: string;
  loginButtonText: string;
  cancelButtonText: string;
  signupLink: string;
  forgotPasswordLink: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
};

export function LoginForm({
  className,
  title,
  description,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  forgotPasswordText,
  signUpText,
  loginButtonText,
  cancelButtonText,
  signupLink,
  forgotPasswordLink,
  onSubmit,
  onCancel,
  onForgotPassword,
  onSignUp,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card data-element-card>
        <CardHeader data-element-card-header>
          <CardTitle data-element-card-title>{title}</CardTitle>
          <CardDescription data-element-card-description>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} data-element-form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" data-element-email-label>{emailLabel}</Label>
                <Input
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
              <span data-element-signup-prompt>{signUpText}</span>
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
        </CardContent>
      </Card>
    </div>
  );
}
