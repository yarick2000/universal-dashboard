import nextAuth, { NextAuthResult } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { SupabaseDataClient } from '@/layers/Data';
import { Logger, LoggerService } from '@/layers/Logging';
import { createLogger } from '@/layers/Logging/utils';

import { AuthenticationProvider } from '../interfaces';

export default class DefaultAuthenticationProvider implements AuthenticationProvider {
  private readonly logger: Logger;
  constructor(
    private readonly loggerService: LoggerService,
    private readonly dataClient: SupabaseDataClient,
  ) {
    this.logger = createLogger(this.loggerService, DefaultAuthenticationProvider.name);
  }

  getProvidersMap() {
    return this.getProviders()
      .map((provider) => {
        if (typeof provider === 'function') {
          const providerData = (provider as () => { id: string; name: string })();
          return { id: providerData.id, name: providerData.name };
        } else {
          return { id: provider.id, name: provider.name };
        }
      })
      .filter((provider) => provider.id !== 'credentials');
  }

  getAuthResult(): NextAuthResult {
    return nextAuth({
      debug: process.env.NODE_ENV !== 'production',
      logger: {
        error:  (code, ...message) => {
          void this.logger.error(`NextAuth error: ${code}`, ...message);
        },
      },
      providers: this.getProviders(),
      callbacks: {
        jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            token.email = user.email;
            token.role = (user as { role?: string }).role;
          }
          return token;
        },
        session({ session, token }) {
          if (token && session.user) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            (session.user as { role?: string }).role = token.role as string;
          }
          return session;
        },
      },
      // pages: { signIn: '/auth/signin' },
    });
  }

  private getProviders() {
    return [
      CredentialsProvider({
        credentials: {
          email: { label: 'Email', type: 'text', placeholder: 'Enter your email' },
          password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
        },
        authorize: async (credentials) => {
          if (!credentials?.email || !credentials?.password) {
            await this.logger.warn('Missing email or password in credentials.');
            throw new Error('Missing email or password');
          }
          const email = credentials.email as string;
          const password = credentials.password as string;
          const token = await this.dataClient?.auth.signInWithPassword({
            email, password,
          });
          if (token?.error || !token?.data?.user) {
            if (token?.error) {
              await this.logger.error(`Supabase sign-in error: ${token.error.message}`, token.error);
              throw new Error(`Sign-in failed: ${token.error.message}`);
            }
          }
          return {
            id: token?.data?.user?.id,
            email: token?.data?.user?.email,
            role: token?.data?.user?.role,
          };
        },
      }),
    ];
  }
}
