export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, '')}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  return 'https://ruqyacenter.com';
}

export function getPageAlternates(locale: string, path: string = '') {
  const baseUrl = getBaseUrl();
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const arUrl = `${baseUrl}${cleanPath || ''}`;
  const trUrl = `${baseUrl}/tr${cleanPath || ''}`;

  return {
    canonical: locale === 'tr' ? trUrl : arUrl,
    languages: {
      ar: arUrl,
      tr: trUrl,
      'x-default': arUrl,
    },
  };
}
