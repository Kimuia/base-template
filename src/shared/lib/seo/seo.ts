import type { Metadata } from 'next';
import type {
  SeoSiteConfig,
  SeoPageOptions,
  SeoDetailOptions,
} from './seo.types';

/**
 * 사이트 전역 SEO 설정 객체 생성
 * @param config - 사이트 SEO 설정
 * @returns 기본값이 적용된 SeoSiteConfig
 */
export function createSeoConfig(config: SeoSiteConfig): SeoSiteConfig {
  return {
    locale: 'ko_KR',
    ...config,
  };
}

/**
 * 루트 레이아웃용 기본 메타데이터 생성
 *
 * @example
 * ```ts
 * // app/layout.tsx
 * import { seoConfig } from '@/shared/lib/seo.config';
 * import { createMetadata } from '@/shared/lib';
 *
 * export const metadata = createMetadata(seoConfig);
 * ```
 */
export function createMetadata(config: SeoSiteConfig): Metadata {
  const {
    siteName,
    siteUrl,
    defaultTitle,
    titleTemplate,
    defaultDescription,
    defaultImage,
    locale = 'ko_KR',
    twitterHandle,
  } = config;

  return {
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description: defaultDescription,
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: 'website',
      siteName,
      locale,
      title: defaultTitle,
      description: defaultDescription,
      url: siteUrl,
      ...(defaultImage && {
        images: [
          { url: defaultImage, width: 1200, height: 630, alt: siteName },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      ...(defaultImage && { images: [defaultImage] }),
      ...(twitterHandle && { creator: twitterHandle }),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * 페이지별 메타데이터 생성 (정적 페이지용)
 *
 * @example
 * ```ts
 * // app/(public)/about/page.tsx
 * import { seoConfig } from '@/shared/lib/seo.config';
 * import { createPageMetadata } from '@/shared/lib';
 *
 * export const metadata = createPageMetadata(seoConfig, {
 *   title: '소개',
 *   description: '서비스 소개 페이지입니다.',
 *   path: '/about',
 * });
 * ```
 */
export function createPageMetadata(
  config: SeoSiteConfig,
  options: SeoPageOptions,
): Metadata {
  const { title, description, path, image, noIndex, keywords } = options;

  const pageDescription = description ?? config.defaultDescription;
  const pageImage = image ?? config.defaultImage;
  const pageUrl = path ? `${config.siteUrl}${path}` : config.siteUrl;

  return {
    title,
    description: pageDescription,
    ...(keywords && { keywords }),
    openGraph: {
      type: 'website',
      title,
      description: pageDescription,
      url: pageUrl,
      siteName: config.siteName,
      ...(pageImage && {
        images: [{ url: pageImage, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: pageDescription,
      ...(pageImage && { images: [pageImage] }),
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

/**
 * 상세 게시글용 동적 메타데이터 생성 (API 데이터 기반)
 *
 * @example
 * ```ts
 * // app/(public)/board/[id]/page.tsx
 * import { seoConfig } from '@/shared/lib/seo.config';
 * import { createDetailMetadata } from '@/shared/lib';
 *
 * export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 *   const { id } = await params;
 *   const result = await getBoardDetail(id);
 *
 *   if (!result.success) {
 *     return createPageMetadata(seoConfig, { title: '게시글' });
 *   }
 *
 *   return createDetailMetadata(seoConfig, {
 *     title: result.data.title,
 *     description: result.data.summary,
 *     path: `/board/${id}`,
 *     image: result.data.thumbnailUrl,
 *     publishedAt: result.data.createdAt,
 *     modifiedAt: result.data.updatedAt,
 *     author: result.data.authorName,
 *     tags: result.data.tags,
 *   });
 * }
 * ```
 */
export function createDetailMetadata(
  config: SeoSiteConfig,
  options: SeoDetailOptions,
): Metadata {
  const {
    title,
    description,
    path,
    image,
    publishedAt,
    modifiedAt,
    author,
    tags,
    type = 'article',
  } = options;

  const pageImage = image ?? config.defaultImage;
  const pageUrl = `${config.siteUrl}${path}`;

  return {
    title,
    description,
    ...(tags && { keywords: tags }),
    openGraph: {
      type,
      title,
      description,
      url: pageUrl,
      siteName: config.siteName,
      ...(pageImage && {
        images: [{ url: pageImage, width: 1200, height: 630, alt: title }],
      }),
      ...(type === 'article' && {
        ...(publishedAt && { publishedTime: publishedAt }),
        ...(modifiedAt && { modifiedTime: modifiedAt }),
        ...(author && { authors: [author] }),
        ...(tags && { tags }),
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(pageImage && { images: [pageImage] }),
    },
  };
}

/**
 * 설명 텍스트를 OG용으로 자르기 (최대 160자)
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이 (기본: 160)
 */
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * HTML 태그 제거 후 순수 텍스트 추출 (SEO description용)
 * @param html - HTML 문자열
 */
export function stripHtmlForSeo(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
