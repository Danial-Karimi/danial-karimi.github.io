/**
 * Personal content. Only verified facts belong here.
 * Rule of thumb: if it cannot be confirmed, leave it out.
 */
export const profile = {
  name: 'دانیال کریمی',
  nameParts: ['دانیال', 'کریمی'] as const,
  nameLatin: 'Danial Karimi',
  /** Verified (existing website). */
  email: 'itsdanialkarimi@gmail.com',

  positioning: 'مهندسی هوش مصنوعی و توسعه نرم‌افزار',
  positioningLatin: ['AI Engineering', 'Backend Development', 'Software Engineering'] as const,

  hero: {
    lede: 'علاقه‌مند به ساخت سیستم‌های هوشمند؛ از مدل‌های یادگیری ماشین تا بک‌اندی که آن‌ها را به محصولی قابل‌استفاده تبدیل می‌کند.',
    figureCaption: 'هر نقطه یک داده، هر خوشه یک معنا',
    figureLabel:
      'تصویرسازی انتزاعی از فضای نهان یک مدل یادگیری ماشین: نقطه‌هایی که در سه خوشه کنار هم جمع شده‌اند.',
  },

  /** Shown on the homepage now; the future About page will reuse the same data. */
  about: {
    heading: 'مدل فقط بخشی از ماجراست',
    paragraphs: [
      'از نوجوانی با دنیای فناوری آشنا شدم. کنجکاویِ برنامه‌نویسی کم‌کم به علاقه‌ای جدی به هوش مصنوعی تبدیل شد و هنوز هم مسیر اصلی یادگیری من است.',
      'اما یک مدل تا وقتی در سرویسی پایدار کار نکند، فقط یک آزمایش است. برای همین می‌خواهم بدانم داده چطور آماده می‌شود، مدل چطور سرو می‌شود و سرویس چطور زیر فشار واقعی دوام می‌آورد؛ و بک‌اند و مهندسی نرم‌افزار را هم دنبال می‌کنم.',
      'هدفم این است که در پروژه‌هایی کار کنم که روی زندگی آدم‌ها اثر مثبت می‌گذارند. یادگیری برای من مرحله‌ای نیست که تمام شود؛ بخشی دائمی از کار است.',
    ],
  },

  /** One unified "contact + collaboration" section. */
  contact: {
    heading: 'بیایید با هم کار کنیم',
    text: 'اگر پروژه‌ای معنادار در حوزه‌ی نرم‌افزار یا هوش مصنوعی دارید، یا دوست دارید درباره‌ی یک ایده‌ی فناورانه گفت‌وگو کنیم، خوشحال می‌شوم بشنوم. ایمیل بهترین راه ارتباط با من است.',
    topicsTitle: 'از این موارد استقبال می‌کنم',
    topics: [
      'ارتباط حرفه‌ای',
      'فرصت‌های همکاری',
      'پروژه‌های معنادار نرم‌افزاری و هوش مصنوعی',
      'ایده‌های فناورانه',
      'فرصت‌های حرفه‌ای مرتبط',
    ],
  },

  footerBlurb:
    'وب‌سایت شخصی دانیال کریمی؛ جایی برای حوزه‌های فعالیت، بلاگ و مسیر یادگیری در هوش مصنوعی و مهندسی نرم‌افزار.',

  /** Used for JSON-LD `knowsAbout`. Interests only — not credentials. */
  knowsAbout: [
    'Artificial Intelligence',
    'Machine Learning',
    'Backend Development',
    'Software Engineering',
  ] as const,

  /**
   * Intentionally not displayed: the previous website lists a city and a birth year,
   * but they cannot be confirmed as current. Add `location` here (and render it) only
   * when the owner confirms it.
   */
  location: null as string | null,
} as const;
