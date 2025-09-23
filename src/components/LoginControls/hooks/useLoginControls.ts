import { useCallback } from 'react';

// import { signInAction } from '@/app/actions/authentication';
import { WindowMessageTypes } from '@/enums';
import { useLocalizations } from '@/layers/Internationalization/hooks/useLocalizations';
import { LoginControlsProps } from '@/shadcn/components/LoginControls';
import { post } from '@/utils/message';

export type UseLoginControlsProps = Omit<LoginControlsProps, | 'loginText' | 'signupText'>;

export function useLoginControls(props: UseLoginControlsProps) : LoginControlsProps {
  const { onLogin, onSignup } = props;
  const t = useLocalizations('components.loginControls');
  const onLoginEvent = useCallback(() => {
    // Handle login logic
    if (onLogin) {
      onLogin();
      return;
    }
    // Send message to show login form
    post(WindowMessageTypes.ShowLoginForm);
    // void signInAction();
  }, [onLogin]);
  const onSignupEvent = useCallback(() => {
    if (onSignup) {
      onSignup();
      return;
    }
    // Navigate to signup page
    post(WindowMessageTypes.ShowSignupForm);
  }, [onSignup]);
  return {
    ...props,
    onLogin: onLoginEvent,
    onSignup: onSignupEvent,
    loginText: t('login'),
    signupText: t('signup'),
  } as LoginControlsProps;
};

