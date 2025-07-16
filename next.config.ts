import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
};


export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  skipWaiting: true,
  register: true,
})(nextConfig) as unknown as NextConfig;
