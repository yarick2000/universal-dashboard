import { LoggerInfoProvider } from '../interfaces';
import { LogMessage } from '../types';

export default class ClientInfoProvider implements LoggerInfoProvider {
  populateWithInfo<T>(message: LogMessage<T>): LogMessage<T> {
    // Populate the log message with client-specific information
    return {
      ...message,
      info: {
        ...message.info,
        browser: this.collectBrowserInfo(),
      },
    };
  }

  private collectBrowserInfo() {
    const browserInfo: Record<string, unknown> = {
      userAgent: navigator.userAgent,
      language: navigator.language,
    };

    // Feature detection for additional browser capabilities
    if ('languages' in navigator) {
      browserInfo.languages = navigator.languages;
    }

    if ('hardwareConcurrency' in navigator) {
      browserInfo.hardwareConcurrency = navigator.hardwareConcurrency;
    }

    if ('deviceMemory' in navigator) {
      browserInfo.deviceMemory = navigator.deviceMemory;
    }

    if ('cookieEnabled' in navigator) {
      browserInfo.cookieEnabled = navigator.cookieEnabled;
    }

    if ('onLine' in navigator) {
      browserInfo.onLine = navigator.onLine;
    }

    if ('webdriver' in navigator) {
      browserInfo.webdriver = navigator.webdriver;
    }

    // Screen information
    if (typeof screen !== 'undefined') {
      browserInfo.screen = {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
      };
    }

    // Timezone
    try {
      browserInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      // Ignore if not supported
    }

    return browserInfo;
  }
}
