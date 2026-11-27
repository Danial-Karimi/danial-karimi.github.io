import type { FaqItem } from '@/types/content';

/** FAQ content — the owner's original Persian wording; edit here only. */
export const faqIntro = {
  title: 'پرسش‌های متداول',
  subtitle: 'چند نکته که شاید بد نباشد درباره من بدانید.',
};

export const faqItems: FaqItem[] = [
  {
    id: 'what-do-you-do',
    question: 'چه کاری انجام می‌دهم؟',
    answer:
      'من مهندس کامپیوتر هستم و تمرکزم بر هوش مصنوعی، یادگیری ماشین و ساخت سیستم‌های نرم‌افزاری هوشمند است.',
  },
  {
    id: 'main-interests',
    question: 'حوزه‌های اصلی مورد علاقه من چیست؟',
    answer: 'هوش مصنوعی، یادگیری ماشین، مهندسی هوش مصنوعی، توسعه نرم‌افزار و استارتاپ‌های مبتنی بر فناوری.',
  },
  {
    id: 'collaboration',
    question: 'آیا از همکاری و فرصت‌های جدید استقبال می‌کنید؟',
    answer:
      'قطعاً! من همیشه مشتاقم با افراد بااستعداد ارتباط برقرار کنم و در پروژه‌های ارزشمند و معنادار همکاری داشته باشم.',
  },
];
