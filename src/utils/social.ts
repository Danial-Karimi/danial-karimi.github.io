import { socialLinks } from '@/data/social-links';
import type { SocialLink } from '@/types/content';

export type SocialPlacement = SocialLink['placements'][number];

/** Links with a configured URL that are allowed in the given placement. */
export function getSocialLinks(placement: SocialPlacement): SocialLink[] {
  return socialLinks.filter((link) => link.url.trim() !== '' && link.placements.includes(placement));
}

/** Verified profile URLs (no mailto) — used for JSON-LD `sameAs`. */
export function getProfileUrls(): string[] {
  return socialLinks
    .map((link) => link.url.trim())
    .filter((url) => url !== '' && !url.startsWith('mailto:'));
}
