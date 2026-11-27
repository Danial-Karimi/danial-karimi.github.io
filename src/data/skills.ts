import type { Skill } from '@/types/content';

/**
 * Skills, grouped by `category` in the order they first appear here.
 *
 * Deliberately NOT included: proficiency levels, percentages or years of experience —
 * none have been confirmed. `level` ('beginner' | 'intermediate' | 'advanced') is supported
 * by the UI and shown as a plain text label; add it per skill only when it is accurate.
 * `description` states what the technology is, not how well it is known.
 */
export const skills: Skill[] = [
  // برنامه‌نویسی
  { id: 'python', name: 'Python', category: 'برنامه‌نویسی', icon: 'python', description: 'زبان برنامه‌نویسی' },
  { id: 'php', name: 'PHP', category: 'برنامه‌نویسی', icon: 'php', description: 'زبان برنامه‌نویسی وب' },

  // توسعه بک‌اند
  { id: 'symfony', name: 'Symfony', category: 'توسعه بک‌اند', icon: 'symfony', description: 'فریم‌ورک PHP' },
  { id: 'mysql', name: 'MySQL', category: 'توسعه بک‌اند', icon: 'mysql', description: 'پایگاه داده‌ی رابطه‌ای' },

  // علم داده و یادگیری ماشین
  { id: 'numpy', name: 'NumPy', category: 'علم داده و یادگیری ماشین', icon: 'numpy', description: 'محاسبات عددی در پایتون' },
  { id: 'pandas', name: 'Pandas', category: 'علم داده و یادگیری ماشین', icon: 'pandas', description: 'پردازش و تحلیل داده' },
  { id: 'scikit-learn', name: 'Scikit-learn', category: 'علم داده و یادگیری ماشین', icon: 'scikit-learn', description: 'یادگیری ماشین در پایتون' },

  // ابزارها و سیستم‌ها
  { id: 'git', name: 'Git', category: 'ابزارها و سیستم‌ها', icon: 'git', description: 'کنترل نسخه' },
  { id: 'linux', name: 'Linux', category: 'ابزارها و سیستم‌ها', icon: 'linux', description: 'سیستم‌عامل' },
];
