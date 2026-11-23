import type { EducationEntry } from '@/types/content';

/**
 * EMPTY ON PURPOSE.
 * No institution, degree or date has been confirmed for this phase, so nothing is invented.
 * (The previous website describes the owner as a school student in a computer field, but that
 * statement is likely outdated.) Add entries here and the homepage preview and the future
 * Education page will render them automatically.
 *
 * Example shape:
 * { id: 'uni', institution: '…', program: '…', period: '…', description: '…' }
 */
export const education: EducationEntry[] = [];
