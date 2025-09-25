'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { loggerService } from '@/index';
import { createLogger } from '@/layers/Logging/utils';

import { GoogleRecaptchaProviderProps } from '../interfaces';

import { GoogleRecaptchaContext } from './GoogleRecaptchaContext';

declare global {
  var grecaptcha: {
    enterprise: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action?: string }) => Promise<string>;
    };
  } | undefined;
}

const DEFAULT_ACTION = 'general';

function buildScriptSrc(siteKey: string, language?: string) {
  const base = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(siteKey)}`;
  return language ? `${base}&hl=${encodeURIComponent(language)}` : base;
}

export const GoogleRecaptchaProvider: React.FC<GoogleRecaptchaProviderProps> = ({
  siteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY || '',
  defaultAction = DEFAULT_ACTION,
  children,
  autoInjectScript = true,
  language,
}) => {
  const logger = createLogger(loggerService, import.meta.url);
  const [isReady, setIsReady] = useState(false);
  const scriptInjectedRef = useRef(false);

  useEffect(() => {
    if (!siteKey) {
      void logger.warn('[GoogleRecaptchaProvider] Missing site key.');
    }
  }, [siteKey, logger]);

  // Inject script
  useEffect(() => {
    if (!autoInjectScript || scriptInjectedRef.current || !siteKey) return;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="https://www.google.com/recaptcha/enterprise.js?render=${siteKey}"]`,
    );
    if (existing) {
      scriptInjectedRef.current = true;
      return;
    }

    const script = document.createElement('script');
    script.src = buildScriptSrc(siteKey, language);
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.grecaptcha?.enterprise) {
        window.grecaptcha.enterprise.ready(() => setIsReady(true));
      }
    };
    script.onerror = async () => {
      await logger.error('[GoogleRecaptchaProvider] Failed to load Google reCAPTCHA script.');
    };
    document.head.appendChild(script);
    scriptInjectedRef.current = true;
  }, [autoInjectScript, siteKey, language, logger]);

  // If script already present (e.g., injected elsewhere), wait for readiness
  useEffect(() => {
    if (!siteKey) return;
    if (window.grecaptcha?.enterprise && !isReady) {
      window.grecaptcha.enterprise.ready(() => setIsReady(true));
    }
  }, [isReady, siteKey]);

  const getToken = useCallback(
    async (action?: string): Promise<string> => {
      if (!siteKey) {
        throw new Error('Google reCAPTCHA site key not configured.');
      }
      if (!window.grecaptcha) {
        throw new Error('grecaptcha not available yet.');
      }
      await new Promise<void>((resolve) => window.grecaptcha!.enterprise.ready(() => resolve()));
      return window.grecaptcha.enterprise.execute(siteKey, { action: action || defaultAction });
    },
    [siteKey, defaultAction],
  );

  return (
    <GoogleRecaptchaContext.Provider
      value={{
        isReady,
        getToken,
      }}
    >
      {children}
    </GoogleRecaptchaContext.Provider>
  );
};
