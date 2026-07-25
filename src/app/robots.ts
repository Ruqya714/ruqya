import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
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
          '/*?*',
        ],
      },
    ],
    sitemap: 'https://ruqyacenter.com/sitemap.xml',
  };
}
