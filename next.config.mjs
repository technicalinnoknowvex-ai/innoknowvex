/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimizations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lwgkwvpeqx5af6xj.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'hfolrvqgjjontjmmaigh.supabase.co',
      },
    ],
    // Add modern image formats for better compression
    // formats: ['image/webp', 'image/avif'],
    // // Optimize image loading
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental CSS optimization (reduces render-blocking)
  experimental: {
    optimizeCss: true,
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production (reduces bundle size)
    removeConsole: process.env.NODE_ENV === 'production',
  },

};

export default nextConfig;