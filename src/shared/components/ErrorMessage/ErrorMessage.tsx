'use client';

import { cn } from '@/shared/utils/cn';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  message = '문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center py-16',
        className,
      )}
    >
      <p className="text-center text-sm text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
