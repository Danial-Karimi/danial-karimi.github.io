/**
 * Scroll reveal for the few elements that opt in ([data-reveal], [data-reveal-rule]).
 * Without JS, or with reduced motion, everything is simply visible (see animations.css).
 */
const items = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-rule]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  items.forEach((el) => el.classList.add('is-in'));
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
  );
  items.forEach((el) => observer.observe(el));
}
