/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No redirecciones ni rewrites
  redirects: async () => [],
  rewrites: async () => [],
  // ¡OJO! No pongas `output: 'export'`
};

module.exports = nextConfig;
