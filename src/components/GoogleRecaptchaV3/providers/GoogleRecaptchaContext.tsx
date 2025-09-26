'use client';
import { createContext } from 'react';

import { GoogleRecaptchaContextValue } from '../interfaces';

export const GoogleRecaptchaContext = createContext<GoogleRecaptchaContextValue>({
  isReady: false,
  // Fallback that always rejects if provider not mounted
  getToken: () => {
    throw new Error('GoogleRecaptchaProvider is not mounted or not ready yet.');
  },
  getRecaptchaComponent: () => {
    throw new Error('GoogleRecaptchaProvider is not mounted or not ready yet.');
  },
});
