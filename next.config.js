/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  trailingSlash: true,
  // compiler: { // uncomment this to enable console logs
  //   removeConsole: {
  //     exclude: ['error'],
  //   },
  // },
};

module.exports = nextConfig;
