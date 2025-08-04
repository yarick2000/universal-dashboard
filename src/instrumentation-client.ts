import { loggerService } from '@/index';

window.addEventListener('error', (event) => {
  loggerService.error(event.message, event.error);
});
