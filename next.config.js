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
};

module.exports = nextConfig;
