import { SessionProvider } from 'next-auth/react';
import { setRequestLocale } from 'next-intl/server';

import { AppHeader } from '@/app/[locale]/components/AppHeader';
import { auth } from '@/auth';
import { featureService, i18nService } from '@/index';
import { fontClasses } from '@/utils/fonts';

import { Layout } from '../components/Layout';

import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';

import '../globals.css';

export default async function LocalizedRootLayout(props: {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}) {
  const params = await props.params;
  const { children } = props;
  const { locale } = params;
  const session = await auth();
  const messages = await i18nService.getMessages(locale);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const analyticsFeature = featureService.getFeature('analytics');
  const speedInsightsFeature = featureService.getFeature('speedInsights');
  setRequestLocale(locale);
  return (
    <Layout
      locale={locale}
      messages={messages}
      timeZone={timeZone}
      className={`${fontClasses} antialiased`}
      enableAnalytics={analyticsFeature.enabled}
      enableSpeedInsights={speedInsightsFeature.enabled}
    >
      <SessionProvider session={session}>
        <AppHeader />
        {children}
        <LoginForm />
        <SignupForm />
      </SessionProvider>
    </Layout>
  );
}
