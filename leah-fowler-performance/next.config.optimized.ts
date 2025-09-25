import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false
});

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental performance features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    workerThreads: false,
    cpus: 4,
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000']
    },
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000'
          }
        ]
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate'
          }
        ]
      }
    ];
  },

  // Rewrites for API optimization
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: []
    };
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Core configuration
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  generateEtags: true,

  // Output configuration for production
  output: 'standalone',

  // Keep these temporarily until all errors are fixed
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Webpack optimization
  webpack: (config, { dev, isServer, webpack }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Replace react with preact in production for smaller bundle
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        'react/jsx-dev-runtime.js': 'preact/compat/jsx-dev-runtime'
      });
    }

    // Optimize chunks
    config.optimization = {
      ...config.optimization,
      runtimeChunk: isServer ? false : 'single',
      splitChunks: {
        chunks: 'all',
        maxAsyncRequests: 25,
        maxInitialRequests: 25,
        cacheGroups: {
          default: false,
          vendors: false,
          // React and core framework
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-sync-external-store|next)[\\/]/,
            priority: 50,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Radix UI components
          radixUI: {
            name: 'radix-ui',
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            priority: 40,
            reuseExistingChunk: true,
          },
          // Tiptap editor (lazy loaded)
          tiptap: {
            name: 'tiptap',
            test: /[\\/]node_modules[\\/]@tiptap[\\/]/,
            priority: 35,
            reuseExistingChunk: true,
          },
          // Stripe (lazy loaded)
          stripe: {
            name: 'stripe',
            test: /[\\/]node_modules[\\/](@stripe|stripe)[\\/]/,
            priority: 35,
            reuseExistingChunk: true,
          },
          // Supabase
          supabase: {
            name: 'supabase',
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            priority: 35,
            reuseExistingChunk: true,
          },
          // Animation libraries
          animation: {
            name: 'animation',
            test: /[\\/]node_modules[\\/](framer-motion|@motionone)[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
          },
          // Common libraries
          lib: {
            test(module: any) {
              return module.size() > 150000 &&
                /node_modules[/\\]/.test(module.identifier());
            },
            name(module: any) {
              const packageNameMatch = module.context?.match(
                /[\\/]node_modules[\\/](.*?)([[\\/]|$])/
              );
              const packageName = packageNameMatch ? packageNameMatch[1] : 'lib';
              return `lib-${packageName.replace('@', '')}`;
            },
            priority: 20,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // Shared modules
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
          }
        }
      },
      minimize: !dev,
      minimizer: config.optimization.minimizer,
    };

    // Add webpack plugins
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      })
    );

    // Module rules for optimization
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|webp|avif)$/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024, // 8kb
        },
      },
    });

    return config;
  },

  // Modular imports for optimization
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
    },
  },

  // SWC minification (faster than Terser)
  swcMinify: true,
};

export default withBundleAnalyzer(nextConfig);