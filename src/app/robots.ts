import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/*/admin/',
          '/healer/',
          '/*/healer/',
          '/auth/',
          '/*/auth/',
          '/api/',
          '/*/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
