import configureWithBundleAnalyzer from '@next/bundle-analyzer';
import configureWithNextIntl from 'next-intl/plugin';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000', 'universal-dashboard.local'],
  /* config options here */
};

const withNextIntl = configureWithNextIntl(
  // This is the default (also the `src` folder is supported out of the box)
  './src/layers/Internationalization/i18n/request.ts',
);

const withBundleAnalyzer = configureWithBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(withNextIntl(nextConfig));
