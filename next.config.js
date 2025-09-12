/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "weboukksa.live",
      },
      {
        protocol: "https",
        hostname: "www.webokksa.com",
      },
      {
        protocol: "https",
        hostname: "webokksa.com",
      },
    ],
  },
  // Ensure Edge Runtime is not used as it might cause issues with Prisma
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'www.webokksa.com', 'webokksa.com'],
    },
  },
  async redirects() {
    return [
      {
        source: '/jobs',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
