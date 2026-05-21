import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz para Turbopack (Next.js 16 syntax)
  turbopack: {
    root: __dirname,
  },
  // Permite cargar imágenes externas (NASA API)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images-assets.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "apod.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
