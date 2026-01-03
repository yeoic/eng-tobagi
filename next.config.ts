import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Skip ESLint during build (run separately with `pnpm lint`)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
