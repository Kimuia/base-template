import { createPageMetadata } from '@/shared/lib';
import { seoConfig } from '@/shared/lib';

export const metadata = createPageMetadata(seoConfig, {
  title: '홈',
  description: '5-Layer Architecture Base Template 홈페이지입니다.',
  path: '/',
});

export default function HomePage() {
  return (
    <main>
      <h1>Base Template</h1>
      <p>5-Layer Architecture Skeleton Project</p>

      {/*
       * === Suspense 전략 패턴 ===
       *
       * 패턴 1: 독립 Suspense 경계 — 각 섹션이 독립적으로 스트리밍
       *
       * <Suspense fallback={<ProductDetailSkeleton />}>
       *   <ProductDetail id={params.id} />
       * </Suspense>
       * <Suspense fallback={<ReviewListSkeleton />}>
       *   <ReviewList productId={params.id} />
       * </Suspense>
       *
       * 패턴 2: 공유 Promise — 동일 데이터를 여러 컴포넌트가 use()로 unwrap
       *
       * const dataPromise = getProductDetail(params.id); // await 하지 않음!
       * <Suspense fallback={<Skeleton className="h-40 w-full" />}>
       *   <ProductInfo dataPromise={dataPromise} />
       *   <ProductPrice dataPromise={dataPromise} />
       * </Suspense>
       *
       * 패턴 3: 병렬 데이터 페칭 (async Server Component 내)
       *
       * async function ProductDetail({ id }: { id: string }) {
       *   const [product, reviews] = await Promise.all([
       *     getProductDetail(id),
       *     getProductReviews(id),
       *   ]);
       *   return <>{...}</>;
       * }
       */}
    </main>
  );
}
