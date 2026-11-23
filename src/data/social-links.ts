import type { SocialLink } from '@/types/content';
import { profile } from './profile';

/**
 * Single source of truth for social links.
 * - Empty `url` hides the link everywhere (no placeholder, no dead icon).
 * - URLs marked "verified" were taken from the existing website.
 * - To add a platform, append an entry here and add its icon to src/assets/icons/brands.ts.
 */
export const socialLinks: SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/danial-karimi', // verified
    icon: 'github',
    handle: 'danial-karimi',
    placements: ['hero', 'contact', 'footer'],
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/DanialKarimiDev/', // verified
    icon: 'linkedin',
    handle: 'DanialKarimiDev',
    placements: ['hero', 'contact', 'footer'],
  },
  {
    id: 'telegram',
    label: 'تلگرام',
    url: 'https://t.me/itsdanialkarimi', // verified
    icon: 'telegram',
    handle: '@itsdanialkarimi',
    placements: ['hero', 'contact', 'footer'],
  },
  {
    id: 'kaggle',
    label: 'Kaggle',
    url: '', // not verified — hidden until filled in
    icon: 'kaggle',
    placements: ['hero', 'contact', 'footer'],
  },
  {
    id: 'x',
    label: 'X',
    url: '', // not verified — hidden until filled in
    icon: 'x-twitter',
    placements: ['hero', 'contact', 'footer'],
  },
  {
    id: 'email',
    label: 'ایمیل',
    url: `mailto:${profile.email}`, // verified
    icon: 'mail',
    handle: profile.email,
    // The email has dedicated UI in the contact section and footer, so it is not
    // repeated in the compact icon rows.
    placements: [],
  },
];
