// project/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ NO usar `output: 'export'` en Vercel cuando tienes rutas dinámicas o API routes
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};

module.exports = nextConfig;
