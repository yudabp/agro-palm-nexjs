/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add Better Auth to external packages
  experimental: {
    serverComponentsExternalPackages: ['better-auth'],
  },
};

export default nextConfig;