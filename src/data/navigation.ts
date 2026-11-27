import type { NavItem } from '@/types/content';

/**
 * Primary navigation. `page` is where each item will live once its phase ships;
 * `anchor` is the matching homepage section that exists today.
 */
export const navItems: NavItem[] = [
  { id: 'home', label: 'خانه', page: '/', anchor: '#top' },
  { id: 'about', label: 'درباره من', page: '/about/', anchor: '#about' },
  { id: 'activities', label: 'فعالیت‌ها', page: '/activities/', anchor: '#activities' },
  { id: 'education', label: 'تحصیلات', page: '/education/', anchor: '#education' },
  { id: 'skills', label: 'مهارت‌ها', page: '/skills/', anchor: '#skills' },
  { id: 'projects', label: 'پروژه‌ها', page: '/projects/', anchor: '#projects' },
  { id: 'blog', label: 'بلاگ', page: '/blog/', anchor: '#blog' },
  { id: 'contact', label: 'تماس', page: '/contact/', anchor: '#contact' },
];

/**
 * Routes that actually exist in the build. Add a route here in the phase that ships it
 * (e.g. '/about/' in phase 02) and every link to it switches from the homepage anchor
 * to the real page — no component changes needed.
 */
export const liveRoutes: ReadonlySet<string> = new Set(['/']);
