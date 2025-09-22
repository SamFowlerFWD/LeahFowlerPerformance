import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 95, 100],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
  },
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  // Compress and optimize build
  compress: true,
  poweredByHeader: false,
  // Enable strict mode for better React optimization
  reactStrictMode: true,
  // Re-enable linting but allow development to continue
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
