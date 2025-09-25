export interface GoogleRecaptchaContextValue {
  isReady: boolean;
  getToken: (action?: string) => Promise<string>;
}

export interface GoogleRecaptchaProviderProps {
  /**
   * Optional override for site key (defaults to environment variable).
   */
  siteKey?: string;
  /**
   * Default action used when none specified by consumer (e.g. 'signup').
   */
  defaultAction?: string;
  /**
   * Children to render once provider sets up.
   */
  children: React.ReactNode;
  /**
   * Whether to inject the script tag automatically.
   */
  autoInjectScript?: boolean;
  /**
   * Language code (hl) parameter if localization is needed.
   */
  language?: string;
}

export interface GoogleRecaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  action?: string;
  'error-codes'?: string[];
}
