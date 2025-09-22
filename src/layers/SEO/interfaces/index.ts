import { Metadata, ResolvingMetadata } from 'next';

import { RouteNames } from '@/enums/Routes';

export interface SEOService {
  generateMetadata(
    route: RouteNames,
    params: Promise<{ [key: string]: string | string[] | undefined }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
    parent: ResolvingMetadata
  ): Promise<Metadata>;
}
