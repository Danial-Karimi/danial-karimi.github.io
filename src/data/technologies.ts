import type { Technology } from '@/types/content';

/**
 * Technologies shown in the homepage marquee. `icon` must exist in src/assets/icons/brands.ts
 * (official, single-colour marks from Simple Icons — rendered white with `currentColor`,
 * never through a CSS filter). To add one: add its mark to brands.ts, then add a line here.
 */
export const technologies: Technology[] = [
  { id: 'python', name: 'Python', icon: 'python' },
  { id: 'php', name: 'PHP', icon: 'php' },
  { id: 'symfony', name: 'Symfony', icon: 'symfony' },
  { id: 'numpy', name: 'NumPy', icon: 'numpy' },
  { id: 'pandas', name: 'Pandas', icon: 'pandas' },
  { id: 'scikit-learn', name: 'Scikit-learn', icon: 'scikit-learn' },
  { id: 'git', name: 'Git', icon: 'git' },
  { id: 'linux', name: 'Linux', icon: 'linux' },
  { id: 'mysql', name: 'MySQL', icon: 'mysql' },
];
