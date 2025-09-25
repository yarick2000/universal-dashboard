'use client';
import { useCallback, useState } from 'react';

import { SignupForm as SignupFormComponent } from '@/components/SignupForm';
import { WindowMessageTypes } from '@/enums';
import { useWindowMessage } from '@/hooks/useWindowMessage';
import { useLocalizations } from '@/layers/Internationalization/hooks/useLocalizations';
import { DialogWrapper } from '@/shadcn/components/DialogWrapper';

export function SignupForm() {
  const t = useLocalizations('components.signupForm');
  const [isOpen, setIsOpen] = useState(false);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useWindowMessage(
    [WindowMessageTypes.ShowSignupForm, WindowMessageTypes.HideSignupForm],
    ({ type }: { type: WindowMessageTypes }) => {
      if (type === WindowMessageTypes.ShowSignupForm) {
        setIsOpen(true);
      } else if (type === WindowMessageTypes.HideSignupForm) {
        setIsOpen(false);
      }
    },
  );

  return (
    <DialogWrapper
      isOpen={isOpen}
      title={t('title')}
      description={t('description')}
      onClose={onClose}
    >
      <SignupFormComponent onCancel={onClose} />
    </DialogWrapper>
  );
}
