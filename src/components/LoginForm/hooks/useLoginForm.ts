import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';

import { authenticateAction } from '@/app/actions/authentication';
import { loggerService } from '@/index';
import { AuthenticationResponseCodes } from '@/layers/Authentication';
import { useLocalizations } from '@/layers/Internationalization/hooks/useLocalizations';
import { createLogger } from '@/layers/Logging/utils';
import { LoginFormProps } from '@/shadcn/components/LoginForm';

export type UseLoginFormProps = Omit<
  LoginFormProps,
  | 'emailLabel'
  | 'emailPlaceholder'
  | 'emailErrorMessage'
  | 'passwordLabel'
  | 'passwordPlaceholder'
  | 'passwordErrorMessage'
  | 'generalErrorMessage'
  | 'forgotPasswordText'
  | 'signUpPrompt'
  | 'signUpText'
  | 'loginButtonText'
  | 'cancelButtonText'
>;

export function useLoginForm(props: UseLoginFormProps): LoginFormProps {
  const {
    signupLink,
    forgotPasswordLink,
    onLogin,
    onCancel,
    onForgotPassword,
    onSignUp,
    onFormSubmit,
    ...rest
  } = props;
  const { update: updateSession} = useSession();
  const logger = createLogger(loggerService, import.meta.url);
  const [ errorMessage, setErrorMessage ] = useState<string | undefined>(undefined);
  const [ isLoggingIn, setIsLoggingIn ] = useState<boolean>(false);
  const [ emailValue, setEmailValue ] = useState<string>('');
  const [ passwordValue, setPasswordValue ] = useState<string>('');
  const t = useLocalizations('components.loginForm');

  const resetErrors = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const onFormSubmitEvent = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    setIsLoggingIn(true);
    if (onFormSubmit) {
      onFormSubmit(e);
    }
  }, [onFormSubmit]);

  const onLoginEvent = useCallback(async(data: FormData) => {
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    setEmailValue(email);
    setPasswordValue(password);
    try {
      const { success, code } = await authenticateAction(email, password);
      if (success) {
        resetErrors();
        await updateSession();
        if (onLogin) {
          await onLogin(data);
        }
      } else {
        switch (code) {
          case AuthenticationResponseCodes.UserNotFound:
            setErrorMessage(t('errors.userNotFound'));
            break;
          case AuthenticationResponseCodes.InvalidCredentials:
            setErrorMessage(t('errors.invalidCredentials'));
            break;
          default:
            setErrorMessage(t('errors.generalErrorMessage'));
            break;
        }
      }
    } catch (error) {
      await logger.error('Failed to login:', error);
      setErrorMessage(t('errors.generalErrorMessage'));
    } finally {
      setIsLoggingIn(false);
    }
  }, [logger, onLogin, resetErrors, t, updateSession]);

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
    emailValue,
    passwordLabel: t('passwordLabel'),
    passwordPlaceholder: t('passwordPlaceholder'),
    passwordValue,
    forgotPasswordText: t('forgotPasswordText'),
    signUpText: t('signUpText'),
    signUpPrompt: t('signUpPrompt'),
    loginButtonText: t('loginButtonText'),
    cancelButtonText: t('cancelButtonText'),
    signupLink: signupLink ?? '#',
    forgotPasswordLink: forgotPasswordLink ?? '#',
    isLoggingIn,
    errorMessage,
    onFormSubmit: onFormSubmitEvent,
    onLogin: onLoginEvent,
    onCancel: onCancelEvent,
    onForgotPassword: onForgotPasswordEvent,
    onSignUp: onSignUpEvent,
  };
}
