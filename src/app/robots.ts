import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/mi-cuenta/', '/checkout/'],
    },
    sitemap: 'https://pgdecants.cl/sitemap.xml', // cambia por tu dominio real
  };
}