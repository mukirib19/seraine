/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // unoptimized: true ensures images always render correctly on Netlify
    // and avoids "/_next/image" 404s in SSR/static environments
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kuiguvaurlhfuwcsyeni.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.ftcdn.net',
      },
    ],
  },
}

module.exports = nextConfig
