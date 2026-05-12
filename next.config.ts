import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  turbopack: {},
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
