'use client';
import { useCallback, useState } from 'react';

import { LoginForm as LoginFormComponent } from '@/components/LoginForm';
import { WindowMessageTypes } from '@/enums';
import { useWindowMessage } from '@/hooks/useWindowMessage';
import { useLocalizations } from '@/layers/Internationalization/hooks/useLocalizations';
import { DialogWrapper } from '@/shadcn/components/DialogWrapper';

export function LoginForm() {
  const t = useLocalizations('components.loginForm');
  const [isOpen, setIsOpen] = useState(false);
  const onLogin = useCallback(async () => {
    await Promise.resolve(setIsOpen(false));
  }, []);
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  useWindowMessage(
    [WindowMessageTypes.ShowLoginForm, WindowMessageTypes.HideLoginForm],
    ({type}: {type: WindowMessageTypes}) => {
      if (type === WindowMessageTypes.ShowLoginForm) {
        setIsOpen(true);
      } else if (type === WindowMessageTypes.HideLoginForm) {
        setIsOpen(false);
      }
    });
  return (
    <DialogWrapper
      isOpen={isOpen}
      title={t('title')}
      description={t('description')}
      onClose={() => setIsOpen(false)}
    >
      <LoginFormComponent onLogin={onLogin} onCancel={onClose} />
    </DialogWrapper>
  );
}
