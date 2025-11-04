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
  },

  experimental: {
    optimizeCss: true,
    
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Add these optimizations:
  poweredByHeader: false,
  compress: true,

};

export default nextConfig;