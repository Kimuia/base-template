import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  output: 'standalone',

  // 이미지 포맷 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    // 외부 패키지 barrel file tree-shaking 최적화
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash-es', 'zod'],

    // Cache Components
    cacheComponents: true,
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
