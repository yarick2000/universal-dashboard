'use client';
import { useEffect, useMemo, useRef } from 'react';

import { loggerService } from '@/index';
import { createLogger } from '@/layers/Logging/utils';

import { useRecaptcha } from '../hooks/useRecaptcha';

type GoogleRecaptchaProps = {
  onToken: (token: string) => void;
  action: string
};

const GoogleRecaptcha: React.FC<GoogleRecaptchaProps> = ({ onToken, action }) => {
  const { isReady, getToken } = useRecaptcha();
  // memoize logger so it does not trigger effect re-runs
  const logger = useMemo(() => createLogger(loggerService, import.meta.url), []);
  // keep latest onToken without re-running effect
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;

    const refresh = setInterval(() => {
      void (async () => {
        try {
          const t = await getToken(action);
          if (!cancelled) onTokenRef.current(t);
        } catch {
          /* ignore refresh errors */
        }
      })();
    }, 110_000);

    const fetchToken = async () => {
      try {
        const token = await getToken(action);
        await logger.debug('[GoogleRecaptcha] Token acquired', { action });
        if (!cancelled) onTokenRef.current(token);
      } catch {
        await logger.error('[GoogleRecaptcha] Token acquisition failed', { action });
      }
    };

    void fetchToken();

    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, [isReady, action, getToken, logger]); // removed onToken & logger to avoid infinite loop

  return null; // No UI
};

export { GoogleRecaptcha };
