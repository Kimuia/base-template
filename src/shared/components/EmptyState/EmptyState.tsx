import { cn } from '@/shared/utils/cn';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function EmptyState({
  title = '데이터가 없습니다',
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className,
      )}
    >
      <p className="text-lg font-medium text-gray-600">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-gray-400">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
