import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://assets.therowdy.club/**')],
  },
};

export default nextConfig;
