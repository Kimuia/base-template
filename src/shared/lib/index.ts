export { createFetcher, api } from './fetcher/fetcher';
export { ApiError } from './fetcher/fetcher.error';
export type {
  FetcherConfig,
  FetcherInstance,
  RequestConfig,
  InterceptorContext,
  RequestInterceptor,
  ResponseInterceptor,
} from './fetcher/fetcher.types';

export {
  createSeoConfig,
  createMetadata,
  createPageMetadata,
  createDetailMetadata,
  truncateDescription,
  stripHtmlForSeo,
} from './seo/seo';
export { seoConfig } from './seo/seo.config';
export type {
  SeoSiteConfig,
  SeoPageOptions,
  SeoDetailOptions,
  SeoMetadata,
} from './seo/seo.types';

export { env } from './env';
export type { Env } from './env';
