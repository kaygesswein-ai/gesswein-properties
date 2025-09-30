/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oubddjjpwpjtsprulpjr.supabase.co', // <-- tu proyecto
        pathname: '/storage/v1/object/public/**',
      },
      // si usas más dominios, añádelos aquí
    ],
  },
};
