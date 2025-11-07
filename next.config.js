/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration (required for Next.js 16)
  turbopack: {},

  // PWA and Service Worker configuration
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression and performance
  compress: true,

  // Enable source maps in production for debugging
  productionBrowserSourceMaps: true,
};

export default nextConfig;