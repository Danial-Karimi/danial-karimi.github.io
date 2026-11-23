import { liveRoutes } from '@/data/navigation';
import type { NavItem } from '@/types/content';

/**
 * Resolves the href for a nav item so that no link ever points to a page that is not built:
 *  1. If the dedicated page is live (listed in `liveRoutes`) → link to it.
 *  2. Otherwise, if the homepage has a matching section → link to that anchor
 *     (`#about` on the homepage, `/#about` from any other page).
 *  3. Otherwise → the homepage.
 */
export function resolveNavHref(item: NavItem, currentPath: string): string {
  const isLive = liveRoutes.has(item.page);
  if (item.page !== '/' && isLive) return item.page;
  if (item.anchor) return currentPath === '/' ? item.anchor : `/${item.anchor}`;
  return '/';
}

import { navItems } from '@/data/navigation';

/** Resolved href for a nav item by id (e.g. `navHref('about', Astro.url.pathname)`). */
export function navHref(id: string, currentPath: string): string {
  const item = navItems.find((entry) => entry.id === id);
  return item ? resolveNavHref(item, currentPath) : '/';
}
