import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/site-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Fetch published articles dynamically from Supabase if configured
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=slug,updated_at&is_published=eq.true`,
        {
          headers: { apikey: supabaseAnonKey },
          next: { revalidate: 3600 },
        }
      );
      if (res.ok) {
        const articles = await res.json();
        for (const article of articles) {
          if (!article.slug) continue;
          const arUrl = `${baseUrl}/blog/${article.slug}`;
          const trUrl = `${baseUrl}/tr/blog/${article.slug}`;
          const lastMod = article.updated_at ? new Date(article.updated_at) : new Date();

          entries.push({
            url: arUrl,
            lastModified: lastMod,
            changeFrequency: 'monthly',
            priority: 0.7,
            alternates: {
              languages: {
                ar: arUrl,
                tr: trUrl,
                'x-default': arUrl,
              },
            },
          });

          entries.push({
            url: trUrl,
            lastModified: lastMod,
            changeFrequency: 'monthly',
            priority: 0.7,
            alternates: {
              languages: {
                ar: arUrl,
                tr: trUrl,
                'x-default': arUrl,
              },
            },
          });
        }
      }
    }
  } catch {
    // Fallback gracefully if database fetch fails during build
  }

  return entries;
}
