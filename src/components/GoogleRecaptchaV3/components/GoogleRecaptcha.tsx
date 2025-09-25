'use client';
import { useEffect, useMemo, useRef } from 'react';

import { loggerService } from '@/index';
import { createLogger } from '@/layers/Logging/utils';

import { useRecaptcha } from '../hooks/useRecaptcha';

// Track initial token fetches per action to avoid double fetch in React 18 StrictMode (dev only)
const initialTokenFetched = new Map<string, boolean>();

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

    const fetchToken = async () => {
      try {
        const token = await getToken(action);
        await logger.debug('[GoogleRecaptcha] Token acquired', { action });
        if (!cancelled) onTokenRef.current(token);
      } catch (error) {
        await logger.error(`[GoogleRecaptcha] Token acquisition failed for action '${action}'.`, error);
      }
    };

    // Only perform the immediate fetch if not already done for this action (prevents double call in dev StrictMode)
    if (!initialTokenFetched.get(action)) {
      initialTokenFetched.set(action, true);
      void fetchToken();
    } else {
      // Optional debug (comment out if noisy)
      void logger.debug(
        `[GoogleRecaptcha] Skipping duplicate initial fetch (StrictMode) for action '${action}'.`,
      );
    }

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

    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, [isReady, action, getToken, logger]); // removed onToken & logger to avoid infinite loop

  return null; // No UI
};

export { GoogleRecaptcha };
