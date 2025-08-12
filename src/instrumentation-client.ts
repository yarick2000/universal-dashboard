import { loggerService } from '@/index';

window.addEventListener('error', (event) => {
  void loggerService.error(event.message, event.error);
});
