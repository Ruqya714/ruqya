import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const routes = [
    '',
    '/about',
    '/services',
    '/booking',
    '/blog',
    '/contact',
    '/faq',
    '/courses',
    '/treatment-journey',
    '/privacy-policy',
    '/terms-of-service',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    // Arabic (default locale: no prefix)
    const arUrl = `${baseUrl}${route}`;
    // Turkish (secondary locale: /tr prefix)
    const trUrl = `${baseUrl}/tr${route}`;

    // Entry for Arabic
    entries.push({
      url: arUrl,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: {
          ar: arUrl,
          tr: trUrl,
          'x-default': arUrl,
        },
      },
    });

    // Entry for Turkish
    entries.push({
      url: trUrl,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: {
          ar: arUrl,
          tr: trUrl,
          'x-default': arUrl,
        },
      },
    });
  }

  return entries;
}
