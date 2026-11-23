import type { Skill } from '@/types/content';

/**
 * EMPTY ON PURPOSE.
 * No skills are assumed. Add entries when they are confirmed; the homepage preview groups
 * them by `category` automatically. `level` is optional and rendered as a text label only —
 * there are no bars, percentages or scores anywhere in the UI.
 *
 * Example shape:
 * { id: 'python', name: 'Python', category: 'زبان‌ها', icon: 'code-xml', description: '…', level: 'intermediate' }
 */
export const skills: Skill[] = [];
