import type { Metadata } from 'next';

/**
 * 사이트 전역 SEO 설정
 */
export interface SeoSiteConfig {
  /** 사이트 이름 (OpenGraph siteName) */
  siteName: string;
  /** 사이트 기본 URL (e.g., 'https://example.com') */
  siteUrl: string;
  /** 기본 페이지 타이틀 */
  defaultTitle: string;
  /** 타이틀 템플릿 (e.g., '%s | 사이트명') */
  titleTemplate: string;
  /** 기본 설명 */
  defaultDescription: string;
  /** 기본 OG 이미지 URL */
  defaultImage?: string;
  /** 로케일 (기본: 'ko_KR') */
  locale?: string;
  /** 트위터 핸들 (e.g., '@username') */
  twitterHandle?: string;
}

/**
 * 페이지별 SEO 옵션
 */
export interface SeoPageOptions {
  /** 페이지 타이틀 (titleTemplate에 적용됨) */
  title: string;
  /** 페이지 설명 (미지정 시 기본 설명 사용) */
  description?: string;
  /** 페이지 경로 (e.g., '/about') */
  path?: string;
  /** OG 이미지 URL (미지정 시 기본 이미지 사용) */
  image?: string;
  /** 검색엔진 인덱싱 차단 여부 */
  noIndex?: boolean;
  /** 키워드 목록 */
  keywords?: string[];
}

/**
 * 상세 게시글 SEO 옵션 (API 데이터 기반)
 */
export interface SeoDetailOptions {
  /** 게시글 제목 */
  title: string;
  /** 게시글 설명/요약 */
  description: string;
  /** 게시글 경로 (e.g., '/board/123') */
  path: string;
  /** 게시글 대표 이미지 URL */
  image?: string;
  /** 게시글 작성일 (ISO 문자열) */
  publishedAt?: string;
  /** 게시글 수정일 (ISO 문자열) */
  modifiedAt?: string;
  /** 작성자 */
  author?: string;
  /** 태그 목록 */
  tags?: string[];
  /** OpenGraph 타입 (기본: 'article') */
  type?: 'article' | 'website';
}

/**
 * createMetadata 반환 타입 (Next.js Metadata)
 */
export type SeoMetadata = Metadata;
