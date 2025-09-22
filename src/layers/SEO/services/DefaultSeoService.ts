import { Metadata, ResolvingMetadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { RouteNames } from '@/enums';
import { getLocalizations } from '@/layers/Internationalization/utils/server/getLocalizations';

import { SEOService } from '../interfaces';

export class DefaultSeoService implements SEOService {
  async generateMetadata(
    route: RouteNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: Promise<{ [key: string]: string | string[] | undefined }>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent: ResolvingMetadata,
  ): Promise<Metadata> {
    // const paramValues = await params;
    // const searchParamsValues = await searchParams;
    // const parentValue = await parent;
    if (route === 'home') return await this.generateHomeMetadata();
    return await this.generateDefaultMetadata();
  }

  private async generateHomeMetadata(): Promise<Metadata> {
    const t = await getLocalizations('SEO.routes.home');
    return {
      title: t('title'),
      description: t('description'),
    };
  }

  private async generateDefaultMetadata(): Promise<Metadata> {
    const t = await getTranslations('SEO');
    return {
      title: t('defaultTitle'),
      description: t('defaultDescription'),
    };
  }

  static inject = [] as const;
}
