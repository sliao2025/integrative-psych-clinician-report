// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Let production builds succeed even with ESLint errors
    ignoreDuringBuilds: true,
  },
  // Optional: if you ever get TS compile errors and want to ship anyway,
  // flip this on—but prefer to keep it false and actually fix types.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Also fixes your earlier <Image> host error:
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
