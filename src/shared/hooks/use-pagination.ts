'use client';

import { useState, useMemo, useCallback } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  offset: number;
  goToPage: (page: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
}

/**
 * 페이지네이션 상태 관리 훅
 * @param options - 페이지네이션 옵션
 * @returns 페이지네이션 상태 및 제어 함수
 */
export function usePagination({
  totalItems,
  itemsPerPage = 20,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const offset = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const isFirstPage = useMemo(() => {
    return currentPage === 1;
  }, [currentPage]);

  const isLastPage = useMemo(() => {
    return currentPage >= totalPages;
  }, [currentPage, totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages],
  );

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    currentPage,
    totalPages,
    offset,
    goToPage,
    goToNext,
    goToPrev,
    isFirstPage,
    isLastPage,
  };
}
