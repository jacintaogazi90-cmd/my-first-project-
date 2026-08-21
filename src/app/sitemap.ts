import type { MetadataRoute } from 'next';
import { rooms } from '@/lib/hotel';
import { siteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ['', '/rooms', '/amenities', '/gallery', '/contact', '/booking'];

  return [
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...rooms.map((room) => ({
      url: `${siteUrl}/rooms/${room.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
