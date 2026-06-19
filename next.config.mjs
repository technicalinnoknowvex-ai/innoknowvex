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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  experimental: {
    optimizeCss: true,
    
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

//   exports : {
//   allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
// }
//   ,
  // Add these optimizations:
  poweredByHeader: false,
  compress: true,

};

export default nextConfig;