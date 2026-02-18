import { cn } from '@/shared/utils/cn';

interface SpinnerProps {
  size?: string;
  className?: string;
}

export function Spinner({ size = '1.5rem', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
