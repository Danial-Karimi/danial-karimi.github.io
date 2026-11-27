import type { EducationEntry } from '@/types/content';

/**
 * Education. Only confirmed information belongs here — no dates, degrees or achievements
 * are invented. `period` and `description` are optional; add them when confirmed and they
 * appear automatically (a timeline is used as soon as an entry has a period).
 */
export const education: EducationEntry[] = [
  {
    id: 'shahid-mohajer-esfahan',
    institution: 'دانشکده فنی و حرفه‌ای شهید محسن مهاجر اصفهان',
    program: 'نرم‌افزار',
  },
];
