import { DI } from '@/enums';
import { SupabaseDataClient } from '@/layers/Data';
import { Logger, LoggerService } from '@/layers/Logging';
import { createLogger } from '@/layers/Logging/utils';

import { UserService } from '../interfaces';

export class DefaultUserService implements UserService {
  private readonly logger: Logger;
  constructor(
    private readonly loggerService: LoggerService,
    private readonly dataClient: SupabaseDataClient,
  ) {
    this.logger = createLogger(this.loggerService, DefaultUserService.name);
  }

  async getUserIdByEmail(email: string): Promise<string | null> {
    if (!this.dataClient) {
      await this.logger.error('Data client is not initialized.');
      return null;
    }
    try {
      const result = await this.dataClient?.rpc('get_user_id_by_email', {
        p_email: email,
      });
      if (result.error) {
        await this.logger.error('Error getting user ID by email:', result.error);
        return null;
      }
      return result.data as string | null;
    } catch (error) {
      await this.logger.error('Error getting user ID by email:', error);
      return null;
    }
  }

  async signupUser(email: string, firstName: string, lastName: string, password: string): Promise<void> {
    if (!this.dataClient) {
      await this.logger.error('Data client is not initialized.');
      throw new Error('Data client is not initialized.');
    }
    const { error } = await this.dataClient.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });
    if (error) {
      await this.logger.error('Error signing up user:', error);
      throw error;
    }
  }

  static inject = [DI.LoggerService, DI.SupabaseDataClient] as const;
}
