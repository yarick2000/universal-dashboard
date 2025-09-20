import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback } from 'react';

// import { signInAction } from '@/app/actions/authentication';
import { WindowMessageTypes } from '@/enums';
import { LoginControlsProps } from '@/shadcn/components/LoginControls';
import { post } from '@/utils/message';

export type UseLoginControlsProps = Omit<LoginControlsProps, | 'loginText' | 'signupText'>;

export function useLoginControls(props: UseLoginControlsProps) : LoginControlsProps {
  const { onLogin, onSignup } = props;
  const t = useTranslations('components.loginControls');
  const locale = useLocale();
  const router = useRouter();
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
    router.push(`${locale}/auth/signup`);
  }, [locale, onSignup, router]);
  return {
    ...props,
    onLogin: onLoginEvent,
    onSignup: onSignupEvent,
    loginText: t('login'),
    signupText: t('signup'),
  } as LoginControlsProps;
};

