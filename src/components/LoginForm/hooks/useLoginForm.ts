import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { LoginFormProps } from '@/shadcn/components/LoginForm';

export type UseLoginFormProps = Omit<
  LoginFormProps,
  | 'emailLabel'
  | 'emailPlaceholder'
  | 'passwordLabel'
  | 'passwordPlaceholder'
  | 'forgotPasswordText'
  | 'signUpText'
  | 'loginButtonText'
  | 'cancelButtonText'
>;

export function useLoginForm(props: UseLoginFormProps): LoginFormProps {
  const { signupLink, forgotPasswordLink, onLogin, onCancel, onForgotPassword, onSignUp, ...rest } = props;
  const t = useTranslations('components.loginForm');

  const onLoginEvent = useCallback((email: string, password: string) => {
    // TODO: implement authentication submit
    if (onLogin) {
      onLogin(email, password);
    }
  }, [onLogin]);

  const onCancelEvent = useCallback(() => {
    // TODO: implement cancel action
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const onForgotPasswordEvent = useCallback(() => {
    // TODO: implement forgot password flow
    if (onForgotPassword) {
      onForgotPassword();
    }
  }, [onForgotPassword]);

  const onSignUpEvent = useCallback(() => {
    // TODO: implement signup navigation
    if (onSignUp) {
      onSignUp();
    }
  }, [onSignUp]);

  return {
    ...rest,
    emailLabel: t('emailLabel'),
    emailPlaceholder: t('emailPlaceholder'),
    passwordLabel: t('passwordLabel'),
    passwordPlaceholder: t('passwordPlaceholder'),
    forgotPasswordText: t('forgotPasswordText'),
    signUpText: t('signUpText'),
    signUpPrompt: t('signUpPrompt'),
    loginButtonText: t('loginButtonText'),
    cancelButtonText: t('cancelButtonText'),
    signupLink: signupLink ?? '#',
    forgotPasswordLink: forgotPasswordLink ?? '#',
    onLogin: onLoginEvent,
    onCancel: onCancelEvent,
    onForgotPassword: onForgotPasswordEvent,
    onSignUp: onSignUpEvent,
  };
}
