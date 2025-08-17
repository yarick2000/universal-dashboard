"use strict";
(() => {
  // src/workers/LoggerWorker/index.ts
  var logBatch = [];
  var idleTimer = null;
  var logToServerBatchSize = 10;
  var logToServerIdleTimeSec = 5;
  var sendBatch = () => {
    if (logBatch.length > 0) {
      postMessage(logBatch);
      logBatch = [];
    }
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  };
  var addLogToBatch = (logData) => {
    logBatch.push(logData);
    if (logBatch.length >= logToServerBatchSize) {
      sendBatch();
      return;
    }
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    idleTimer = setTimeout(sendBatch, logToServerIdleTimeSec * 1e3);
  };
  onmessage = (event) => {
    const { type } = event.data;
    if (!type) {
      addLogToBatch({
        source: "client",
        level: "error",
        message: "Logger worker missing type parameter",
        timestamp: Date.now().valueOf(),
        browserInfo: collectBrowserInfo()
      });
      return;
    }
    if (type === "dispose") {
      sendBatch();
      close();
      return;
    }
    if (type === "init") {
      const { batchSize, idleTime } = event.data;
      logToServerBatchSize = batchSize;
      logToServerIdleTimeSec = idleTime;
      return;
    }
    const { message, args } = event.data;
    addLogToBatch({
      source: "client",
      level: type,
      message,
      args,
      browserInfo: collectBrowserInfo(),
      timestamp: Date.now().valueOf()
    });
  };
  function collectBrowserInfo() {
    const browserInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language
    };
    if ("languages" in navigator) {
      browserInfo.languages = navigator.languages;
    }
    if ("hardwareConcurrency" in navigator) {
      browserInfo.hardwareConcurrency = navigator.hardwareConcurrency;
    }
    if ("deviceMemory" in navigator) {
      browserInfo.deviceMemory = navigator.deviceMemory;
    }
    if ("cookieEnabled" in navigator) {
      browserInfo.cookieEnabled = navigator.cookieEnabled;
    }
    if ("onLine" in navigator) {
      browserInfo.onLine = navigator.onLine;
    }
    if ("webdriver" in navigator) {
      browserInfo.webdriver = navigator.webdriver;
    }
    if (typeof screen !== "undefined") {
      browserInfo.screen = {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      };
    }
    try {
      browserInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
    }
    return browserInfo;
  }
})();
//# sourceMappingURL=LoggerWorker.js.map
