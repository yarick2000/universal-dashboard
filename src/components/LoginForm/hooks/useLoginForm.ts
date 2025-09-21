import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import { authenticateAction } from '@/app/actions/authentication';
import { WindowMessageTypes } from '@/enums';
import { loggerService } from '@/index';
import { AuthenticationResponseCodes } from '@/layers/Authentication';
import { createLogger } from '@/layers/Logging/utils';
import { LoginFormProps } from '@/shadcn/components/LoginForm';
import { post } from '@/utils/message';

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
  const [ passwordErrorMessage, setPasswordErrorMessage ] = useState<string | undefined>(undefined);
  const [ emailErrorMessage, setEmailErrorMessage ] = useState<string | undefined>(undefined);
  const [ generalErrorMessage, setGeneralErrorMessage ] = useState<string | undefined>(undefined);
  const [ isLoggingIn, setIsLoggingIn ] = useState<boolean>(false);
  const t = useTranslations('components.loginForm');

  const resetErrors = useCallback(() => {
    setEmailErrorMessage(undefined);
    setPasswordErrorMessage(undefined);
    setGeneralErrorMessage(undefined);
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
    try {
      const { success, code } = await authenticateAction(email, password);
      if (success) {
        resetErrors();
        await updateSession();
        post(WindowMessageTypes.HideLoginForm);
        if (onLogin) {
          await onLogin(data);
        }
      } else {
        switch (code) {
          case AuthenticationResponseCodes.UserNotFound:
            setEmailErrorMessage(t('errors.userNotFound'));
            break;
          case AuthenticationResponseCodes.InvalidCredentials:
            setPasswordErrorMessage(t('errors.invalidCredentials'));
            break;
          default:
            setGeneralErrorMessage(t('errors.generalErrorMessage'));
            break;
        }
      }
    } catch (error) {
      await logger.error('Failed to login:', error);
      setGeneralErrorMessage(t('errors.generalErrorMessage'));
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
    passwordLabel: t('passwordLabel'),
    passwordPlaceholder: t('passwordPlaceholder'),
    forgotPasswordText: t('forgotPasswordText'),
    signUpText: t('signUpText'),
    signUpPrompt: t('signUpPrompt'),
    loginButtonText: t('loginButtonText'),
    cancelButtonText: t('cancelButtonText'),
    signupLink: signupLink ?? '#',
    forgotPasswordLink: forgotPasswordLink ?? '#',
    isLoggingIn,
    generalErrorMessage,
    passwordErrorMessage,
    emailErrorMessage,
    onFormSubmit: onFormSubmitEvent,
    onLogin: onLoginEvent,
    onCancel: onCancelEvent,
    onForgotPassword: onForgotPasswordEvent,
    onSignUp: onSignUpEvent,
  };
}
