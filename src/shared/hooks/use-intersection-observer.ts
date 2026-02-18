'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  frozen?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: (node: Element | null) => void;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * Intersection Observer를 사용한 요소 가시성 감지 훅
 * 무한 스크롤, 지연 로딩 등에 활용
 * @param options - Intersection Observer 옵션
 * @returns ref 콜백, 교차 상태, entry 객체
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    frozen = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<Element | null>(null);

  const ref = useCallback(
    (node: Element | null) => {
      // 이전 observer 정리
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // frozen 상태거나 node가 없으면 종료
      if (frozen || !node) {
        elementRef.current = null;
        return;
      }

      // 새 observer 생성
      observerRef.current = new IntersectionObserver(
        ([observerEntry]) => {
          setEntry(observerEntry);
          setIsIntersecting(observerEntry.isIntersecting);
        },
        { threshold, root, rootMargin },
      );

      observerRef.current.observe(node);
      elementRef.current = node;
    },
    [threshold, root, rootMargin, frozen],
  );

  useEffect(() => {
    // cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    ref,
    isIntersecting,
    entry,
  };
}
