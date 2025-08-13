'use client';

import { PropsWithChildren, useEffect } from 'react';

import { loggerService } from '@/index';

export function WithApplicationCleanup({ children }: PropsWithChildren) {
  useEffect(() => {
    // Cleanup on unmount or page unload
    const handleBeforeUnload = () => {
      // Fire and forget, do not return a promise
      void loggerService.dispose();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also dispose when component unmounts
      void loggerService.dispose();
    };
  }, []);

  return <>{children}</>;
};
