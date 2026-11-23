import { siteConfig } from '@/data/site';
import { profile } from '@/data/profile';
import { getProfileUrls } from './social';

export const absoluteUrl = (path = '/'): string => new URL(path, siteConfig.url).toString();

export function personJsonLd() {
  const sameAs = getProfileUrls();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': absoluteUrl('/#person'),
    name: profile.name,
    alternateName: profile.nameLatin,
    url: absoluteUrl('/'),
    email: `mailto:${profile.email}`,
    description: siteConfig.description,
    knowsAbout: [...profile.knowsAbout],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: absoluteUrl('/'),
    name: siteConfig.name,
    alternateName: siteConfig.nameLatin,
    description: siteConfig.description,
    inLanguage: siteConfig.lang,
    publisher: { '@id': absoluteUrl('/#person') },
  };
}

/** Safe to embed inside <script type="application/ld+json">. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
