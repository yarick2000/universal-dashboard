import { loggerService } from '@/index';
import { createLogger } from '@/layers/Logging/utils';

const logger = createLogger(loggerService, import.meta.url);

window.addEventListener('error', (event) => {
  void logger.error(event.message, event.error);
});
