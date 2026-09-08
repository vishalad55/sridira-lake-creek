/** @type {import('next').NextConfig} */

// Two deploy targets:
//  - Vercel / Node (default): next/image optimisation on, /api/lead live.
//  - Static export (NEXT_STATIC_EXPORT=1): images unoptimised, and /api/lead is
//    not emitted into out/ — a POST route handler cannot be statically served.
//    Point NEXT_PUBLIC_LEAD_ENDPOINT at an external collector instead (the GHL
//    inbound webhook directly, or a small serverless function).
const isStaticExport = process.env.NEXT_STATIC_EXPORT === '1';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  ...(isStaticExport ? { output: 'export', trailingSlash: true } : {}),

  images: {
    unoptimized: isStaticExport,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 828, 1080, 1200, 1600, 1920, 2560],
  },
};

module.exports = nextConfig;
