'use client';

import { useContext } from 'react';

import { GoogleRecaptchaContext } from '../providers/GoogleRecaptchaContext';

export const useRecaptcha = () => {
  const ctx = useContext(GoogleRecaptchaContext);
  return ctx;
};
