/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Placeholder art is served from /public. Real photography drops in the same
    // paths at the same aspect ratios — see README "Swapping in real photos".
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 828, 1080, 1280, 1920],
    imageSizes: [96, 160, 256, 384],
  },
  poweredByHeader: false,
};

export default nextConfig;
