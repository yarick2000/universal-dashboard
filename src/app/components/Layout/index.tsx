import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';

import { WithApplicationCleanup } from '@/components/WithApplicationCleanup';

type LayoutProps = {
  timeZone: string;
  className?: string;
  children: React.ReactNode;
  locale: string;
  messages: { [key: string]: unknown };
  enableAnalytics?: boolean;
  enableSpeedInsights?: boolean;
};

export function Layout({
  children,
  locale,
  messages,
  timeZone,
  className,
  enableAnalytics,
  enableSpeedInsights,
}: LayoutProps) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={className}>
        <NextIntlClientProvider
          timeZone={timeZone}
          locale={locale}
          messages={messages}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={<div>Loading...</div>}>
              <WithApplicationCleanup>
                <div className="min-h-screen">
                  {children}
                </div>
              </WithApplicationCleanup>
            </Suspense>
          </ThemeProvider>
        </NextIntlClientProvider>
        {enableAnalytics && <Analytics />}
        {enableSpeedInsights && <SpeedInsights />}
      </body>
    </html>
  );
}
