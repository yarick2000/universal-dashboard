import { LoggerWorkerDisposeMessage, LoggerWorkerInitMessage, LoggerWorkerMessage } from './types';

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

onmessage = (
  event: MessageEvent<LoggerWorkerMessage<unknown> | LoggerWorkerInitMessage | LoggerWorkerDisposeMessage>,
) => {
  const { type } = event.data;
  if (!type) {
    addLogToBatch({
      source: 'client',
      level: 'error',
      message: 'Logger worker missing type parameter',
      timestamp: Date.now(),
    });
    return;
  }
  if (type === 'dispose') {
    sendBatch();
    close();
    return;
  }

  if (type === 'init') {
    const { batchSize, idleTime }: LoggerWorkerInitMessage = event.data;
    logToServerBatchSize = batchSize;
    logToServerIdleTimeSec = idleTime;
    return;
  }

  if (type === 'log') {
    const { data } = event.data;
    if (Array.isArray(data)) {
      data.forEach((logMessage) => addLogToBatch(logMessage));
    } else {
      addLogToBatch(data);
    }
  }
};
