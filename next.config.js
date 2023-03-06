/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  // compiler: { // uncomment this to enable console logs
  //   removeConsole: {
  //     exclude: ['error'],
  //   },
  // },
};

module.exports = nextConfig;
