import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
  remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: '*.ufs.sh',
      },
    ],
  },
  allowedDevOrigins: ['stinky-perjury-greasily.ngrok-free.dev'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'stinky-perjury-greasily.ngrok-free.dev'],
    },
  },
};

export default nextConfig;
