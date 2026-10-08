import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local public/ images without a remote loader
    unoptimized: true,
  },
};

export default nextConfig;
