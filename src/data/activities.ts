import type { Activity } from '@/types/content';

/**
 * Areas of interest, not claims of mastery. Descriptions describe what is being
 * learned and pursued. `size` and `visual` drive the homepage composition;
 * the future Activities page can reuse the same list.
 */
export const activities: Activity[] = [
  {
    id: 'ai',
    title: 'هوش مصنوعی',
    description:
      'مسیر اصلی یادگیری و کنجکاوی من: از مفاهیم پایه تا اینکه مدل‌های امروزی چطور و چرا کار می‌کنند.',
    icon: 'brain-circuit',
    accent: 'blue',
    size: 'xl',
    visual: 'attention',
  },
  {
    id: 'ml',
    title: 'یادگیری ماشین',
    description:
      'طبقه‌بندی، رگرسیون، خوشه‌بندی و یادگیری عمیق، همراه با تمرین عملی روی مسئله‌ها.',
    icon: 'chart-scatter',
    accent: 'violet',
    size: 'lg',
    visual: 'scatter',
  },
  {
    id: 'backend',
    title: 'مهندسی بک‌اند',
    description:
      'یادگیری ساخت سرویس‌ها و APIهایی که داده و مدل را قابل‌اعتماد در دسترس قرار می‌دهند.',
    icon: 'server',
    accent: 'cyan',
    size: 'lg',
    visual: 'lanes',
  },
  {
    id: 'software',
    title: 'توسعه نرم‌افزار',
    description: 'از اسکریپت‌های کوچک تا نرم‌افزار کاربردی، با تمرکز بر کدی خوانا و قابل‌نگهداری.',
    icon: 'code-xml',
    accent: 'lavender',
    size: 'sm',
    visual: 'brackets',
  },
  {
    id: 'systems',
    title: 'سیستم‌های هوشمند',
    description:
      'کنار هم گذاشتن داده، مدل و زیرساخت تا چیزی بسازم که فقط یک دمو نباشد و واقعاً کار کند.',
    icon: 'network',
    accent: 'blue',
    size: 'md',
    visual: 'graph',
  },
];
