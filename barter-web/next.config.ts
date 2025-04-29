import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
  },
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = 'cheap-module-source-map'; // lub 'eval-source-map'
    }
    return config;
  },
};

export default nextConfig;

