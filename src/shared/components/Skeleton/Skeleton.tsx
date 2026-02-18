import { cn } from '@/shared/utils/cn';

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton 로딩 플레이스홀더
 *
 * 높이/너비는 Tailwind 클래스로 제어 (인라인 스타일 지양)
 *
 * @example
 * <Skeleton className="h-5 w-full" />
 * <Skeleton className="h-10 w-48 rounded-full" />
 * <Skeleton className="h-[300px] w-full rounded-lg" />
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded bg-gray-200', className)}
      aria-hidden="true"
    />
  );
}
