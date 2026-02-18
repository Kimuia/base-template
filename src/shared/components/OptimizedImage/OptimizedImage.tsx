import Image, { type ImageProps } from 'next/image';
import { cn } from '@/shared/utils/cn';

/**
 * next/image 최적화 래퍼
 *
 * - quality 기본값 75 명시
 * - preload: LCP(Above the fold) 이미지에 사용
 * - sizes: 반응형 레이아웃에서 필수 (불필요한 큰 이미지 다운로드 방지)
 *
 * @example
 * // LCP 히어로 이미지
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero"
 *   width={1200}
 *   height={600}
 *   preload
 *   quality={80}
 *   sizes="100vw"
 * />
 *
 * // 일반 썸네일
 * <OptimizedImage
 *   src="/thumb.jpg"
 *   alt="Thumbnail"
 *   width={400}
 *   height={300}
 *   sizes="(max-width: 768px) 100vw, 400px"
 * />
 *
 * // fill 모드 (부모 컨테이너 기준)
 * <div className="relative h-64 w-full">
 *   <OptimizedImage
 *     src="/banner.jpg"
 *     alt="Banner"
 *     fill
 *     sizes="100vw"
 *     className="object-cover"
 *   />
 * </div>
 */

interface OptimizedImageProps extends Omit<ImageProps, 'quality'> {
  quality?: number;
}

export function OptimizedImage({
  quality = 75,
  className,
  alt,
  ...props
}: OptimizedImageProps) {
  return (
    <Image alt={alt} quality={quality} className={cn(className)} {...props} />
  );
}
