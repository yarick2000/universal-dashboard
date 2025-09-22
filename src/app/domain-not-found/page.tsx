import { setRequestLocale } from 'next-intl/server';

import { featureService, i18nService } from '@/index';
import { fontClasses } from '@/utils/fonts';

import { DomainNotFound as DomainNotFoundComponent } from '../components/DomainNotFound';
import { Layout } from '../components/Layout';

export default function DomainNotFound() {
  const locale = i18nService.getDefaultLocale();
  const messages = i18nService.getDefaultMessages();
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
      <DomainNotFoundComponent />
    </Layout>
  );
}
