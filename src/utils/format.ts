const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Converts Latin digits in a string or number to Persian digits. */
export function toFaDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)] ?? d);
}

/** Long Persian (Solar Hijri) date, e.g. «۳ آذر ۱۴۰۵». */
export function formatFaDate(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** Machine-readable date for <time datetime>. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Rough reading time for Persian prose (~180 words per minute), never below one minute. */
export function readingTimeMinutes(text: string, wordsPerMinute = 180): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function formatReadingTime(minutes: number): string {
  return `${toFaDigits(minutes)} دقیقه مطالعه`;
}

/** Current year label for the footer, in Persian digits. */
export function currentYearLabel(calendar: 'persian' | 'gregory' = 'persian', date = new Date()): string {
  const locale = calendar === 'persian' ? 'fa-IR-u-ca-persian' : 'fa-IR-u-ca-gregory';
  return new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
}
