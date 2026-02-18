import { createSeoConfig } from './seo';

/**
 * 사이트 전역 SEO 설정
 *
 * 프로젝트에 맞게 수정하여 사용하세요.
 * 환경 변수를 통해 siteUrl을 설정할 수 있습니다.
 */
export const seoConfig = createSeoConfig({
  siteName: 'Base Template',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  defaultTitle: 'Base Template',
  titleTemplate: '%s | Base Template',
  defaultDescription: '5-Layer Architecture Base Template',
  defaultImage: '/og-default.png',
  locale: 'ko_KR',
  // twitterHandle: '@username',
});
