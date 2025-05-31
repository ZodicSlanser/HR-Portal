import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Turbopack configuration (stable API)
  turbopack: {
    // Optimize module resolution
    resolveAlias: {
      '@': './src',
      '@/components': './src/components',
      '@/lib': './src/lib',
      '@/hooks': './src/hooks',
    },
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Vercel deployment optimizations
  // output: 'standalone', // Remove this for Vercel - causes routes-manifest issues
  
  // Bundle analysis (uncomment for bundle size analysis)
  // bundlePagesRouterDependencies: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
