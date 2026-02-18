/**
 * Dynamic Import + Preload on Intent 패턴
 *
 * === 패턴 1: 클라이언트 전용 (SSR 비활성화) ===
 *
 * import dynamic from 'next/dynamic';
 *
 * const RichTextEditor = dynamic(
 *   () => import('@/module/post/write/components/RichTextEditor'),
 *   { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> },
 * );
 *
 * === 패턴 2: 조건부 로딩 (모달, 드로어) ===
 *
 * const HeavyModal = dynamic(
 *   () => import('@/shared/components/HeavyModal'),
 *   { loading: () => <Spinner /> },
 * );
 *
 * === 패턴 3: Preload on User Intent ===
 *
 * hover/focus 시점에 미리 로드하여 체감 속도 개선.
 * (Vercel 베스트 프랙티스 bundle-preload)
 *
 * const HeavyModal = dynamic(() => import('./HeavyModal'));
 * const preloadModal = () => { void import('./HeavyModal'); };
 *
 * function OpenModalButton() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   return (
 *     <button
 *       onMouseEnter={preloadModal}
 *       onFocus={preloadModal}
 *       onClick={() => setIsOpen(true)}
 *     >
 *       Open
 *     </button>
 *   );
 * }
 *
 * === 적용 기준 ===
 *
 * | 상황                     | dynamic import | preload |
 * |--------------------------|:-:|:-:|
 * | 초기 뷰포트 밖 무거운 컴포넌트 | O | - |
 * | 조건부 표시 (모달, 드로어)    | O | O |
 * | 클라이언트 전용 (에디터, 차트) | O (ssr:false) | - |
 * | LCP 영역 컴포넌트           | X | - |
 *
 * === 무거운 컴포넌트 후보 ===
 *
 * - 리치 텍스트 에디터 (Tiptap, Quill 등)
 * - 차트 라이브러리 (Recharts, Chart.js 등)
 * - 지도 컴포넌트 (Google Maps, Kakao Map 등)
 * - 코드 하이라이터 (Prism, Shiki 등)
 * - 이미지 크롭/편집 컴포넌트
 */

import type { ComponentType } from 'react';

/**
 * preload 함수 생성 헬퍼
 *
 * @example
 * const preloadModal = createPreload(() => import('./HeavyModal'));
 *
 * <button onMouseEnter={preloadModal} onFocus={preloadModal}>
 *   Open
 * </button>
 */
export function createPreload<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
): () => void {
  let preloaded = false;
  return () => {
    if (!preloaded) {
      preloaded = true;
      void importFn();
    }
  };
}
