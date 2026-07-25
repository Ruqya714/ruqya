import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ruqyacenter.com';
  const locales = ['ar', 'tr'];
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
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar${route}`,
            tr: `${baseUrl}/tr${route}`,
          },
        },
      });
    }
  }

  return entries;
}
