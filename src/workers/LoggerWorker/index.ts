import { LoggerWorkerInitMessage, LoggerWorkerMessage } from './types';

let logBatch: unknown[] = [];
let idleTimer: NodeJS.Timeout | null = null;
let logToServerBatchSize = 10;
let logToServerIdleTimeSec = 5;

const sendBatch = () => {
  if (logBatch.length > 0) {
    postMessage(logBatch);
    logBatch = [];
  }
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
};

const addLogToBatch = (logData: unknown) => {
  logBatch.push(logData);

  // Send batch if size limit reached
  if (logBatch.length >= logToServerBatchSize) {
    sendBatch();
    return;
  }

  // Reset idle timer
  if (idleTimer) {
    clearTimeout(idleTimer);
  }
  idleTimer = setTimeout(sendBatch, logToServerIdleTimeSec * 1000);
};

onmessage = (event: MessageEvent<LoggerWorkerMessage<unknown> | LoggerWorkerInitMessage>) => {
  const { type } = event.data;
  if (!type) {
    addLogToBatch({
      source: 'client',
      level: 'error',
      message: 'Logger worker missing type parameter',
      timestamp: Date.now().valueOf(),
      browserInfo: collectBrowserInfo(),
    });
    return;
  }
  if (type === 'init') {
    const { batchSize, idleTime }: LoggerWorkerInitMessage = event.data;
    logToServerBatchSize = batchSize;
    logToServerIdleTimeSec = idleTime;
    return;
  }
  const { message, args }: LoggerWorkerMessage<unknown> = event.data;
  addLogToBatch({
    source: 'client',
    level: type,
    message,
    args,
    browserInfo: collectBrowserInfo(),
    timestamp: Date.now().valueOf(),
  });
};

function collectBrowserInfo() {
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
