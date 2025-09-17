import { useCallback } from 'react';

import { HomeButtonProps } from '@/shadcn/components/HomeButton';

export type UseHomeButtonProps = Omit<HomeButtonProps, 'onNavigateHome'>;

export function useHomeButton(props: UseHomeButtonProps): HomeButtonProps {
  const onNavigateHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  return {
    ...props,
    onNavigateHome,
  };
}
