
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "lwgkwvpeqx5af6xj.public.blob.vercel-storage.com",
//         hostname: 'hfolrvqgjjontjmmaigh.supabase.co',
//         port: '',
//         pathname: '/storage/v1/object/sign/**',
//       },
//     ],
//   },
// };

// export default nextConfig;


const nextConfig = {
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
  },
};

export default nextConfig;