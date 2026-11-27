import type { JourneyStage } from '@/types/content';

/**
 * Development journey. These are CONCEPTUAL areas of growth, not a verified chronology:
 * no dates, employers or achievements are stated, and the page says so explicitly.
 * Order = the order shown. Add or reorder freely; the layout adapts.
 */
export const journeyIntro = {
  title: 'مسیر رشد من',
  lede: 'پنج حوزه‌ای که در آن‌ها رشد می‌کنم. این‌ها گاه‌شمار رسمی نیستند؛ نشان می‌دهند در چه جهتی حرکت می‌کنم.',
  note: 'حوزه‌های رشد، نه تاریخچه‌ی رسمی',
};

export const journeyStages: JourneyStage[] = [
  {
    id: 'foundations',
    title: 'پایه‌ها',
    label: 'Foundations',
    description: 'یادگیری مبانی علوم کامپیوتر و برنامه‌نویسی.',
  },
  {
    id: 'software-engineering',
    title: 'مهندسی نرم‌افزار',
    label: 'Software Engineering',
    description: 'توسعه نرم‌افزار و ساخت سیستم‌های ساختارمند.',
  },
  {
    id: 'artificial-intelligence',
    title: 'هوش مصنوعی',
    label: 'Artificial Intelligence',
    description: 'کاوش در هوش مصنوعی و یادگیری ماشین.',
  },
  {
    id: 'building-systems',
    title: 'ساخت سیستم‌ها',
    label: 'Building Systems',
    description: 'تمرکز بر سیستم‌های هوشمند و محصولات فناورانه.',
  },
  {
    id: 'research-innovation',
    title: 'پژوهش و نوآوری',
    label: 'Research & Innovation',
    description: 'کاوش در فناوری‌های آینده، پژوهش و ایده‌های تازه.',
  },
];
