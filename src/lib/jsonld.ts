import { getBaseUrl } from './site-url';

export function getOrganizationSchema(locale: string) {
  const isTr = locale === 'tr';
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'HealthAndBeautyBusiness'],
    '@id': `${baseUrl}/#organization`,
    name: isTr
      ? "Ruqya Center | Kur'an ile Şifa ve Danışmanlık Merkezi"
      : 'مركز الرقية بكلام الرحمن لرد كيد الشيطان',
    alternateName: isTr ? 'Ruqya Center' : 'مركز الرقية الشرعية',
    url: isTr ? `${baseUrl}/tr` : baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      caption: isTr ? 'Ruqya Center Logo' : 'شعار مركز الرقية الشرعية',
    },
    image: `${baseUrl}/logo.png`,
    description: isTr
      ? "İstanbul'da Kur'an-ı Kerim ve Sünnet ışığında uzman ekibimizle Manevi Şifa, Ruqya ve Danışmanlık Hizmetleri sunuyoruz."
      : 'مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم في إسطنبول. نقدم استشارات أونلاين، تشخيص روحاني، وعلاج بإشراف خاص.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Istanbul',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.0082',
      longitude: '28.9784',
    },
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    areaServed: [
      { '@type': 'Country', name: 'Turkey' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Worldwide' },
    ],
    knowsLanguage: ['ar', 'tr', 'en'],
  };
}

export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getServicesSchema(
  services: Array<{ name: string; description: string; url: string }>,
  locale: string
) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'tr' ? 'Hizmetlerimiz' : 'خدماتنا العلاجية',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        url: service.url,
        provider: {
          '@id': `${baseUrl}/#organization`,
        },
      },
    })),
  };
}

export function getArticleSchema(article: {
  title: string;
  excerpt?: string;
  slug: string;
  coverImage?: string | null;
  publishedAt?: string;
  authorName?: string;
}, locale: string) {
  const baseUrl = getBaseUrl();
  const url = locale === 'tr' 
    ? `${baseUrl}/tr/blog/${encodeURIComponent(article.slug)}` 
    : `${baseUrl}/blog/${encodeURIComponent(article.slug)}`;
  const defaultImage = `${baseUrl}/logo.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: article.title,
    description: article.excerpt || article.title,
    image: article.coverImage || defaultImage,
    datePublished: article.publishedAt || new Date().toISOString(),
    dateModified: article.publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article.authorName || (locale === 'tr' ? 'Ruqya Center Uzmanı' : 'مركز الرقية الشرعية'),
    },
    publisher: {
      '@type': 'Organization',
      name: locale === 'tr' ? 'Ruqya Center' : 'مركز الرقية بكلام الرحمن',
      logo: {
        '@type': 'ImageObject',
        url: defaultImage,
      },
    },
  };
}

export function getCourseSchema(courses: Array<{
  name: string;
  description: string;
  url: string;
}>, locale: string) {
  const baseUrl = getBaseUrl();
  return courses.map((course) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    url: course.url,
    category: locale === 'tr' ? 'Rukye Eğitimi ve Danışmanlık' : 'علوم الرقية الشرعية والطب النبوي والتأهيل المعرفي',
    provider: {
      '@type': 'Organization',
      name: locale === 'tr' ? 'Ruqya Center' : 'مركز الرقية بكلام الرحمن',
      sameAs: locale === 'tr' ? `${baseUrl}/tr` : baseUrl,
    },
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        courseWorkload: 'PT10H',
      },
    ],
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        category: 'Free',
        availability: 'https://schema.org/InStock',
      },
    ],
  }));
}
