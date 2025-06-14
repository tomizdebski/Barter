import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      '172.31.9.218',                  // lokalne IP (jeśli nadal używasz)
      'localhost',                    // lokalne testy
      'barter-roz3.onrender.com',     // 👈 backend Render – to dodaj koniecznie!
    ],
  },
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = 'cheap-module-source-map'; // lub 'eval-source-map'
    }
    return config;
  },
};

export default nextConfig;


