/**
 * Lucide icons (https://lucide.dev), ISC License.
 * Vendored subset so the site ships no icon runtime. To add an icon, copy its
 * SVG children from lucide.dev into this map (key = kebab-case icon name).
 * All icons share: viewBox 0 0 24 24, stroke=currentColor, fill=none, stroke-width 2, round caps/joins.
 */
export interface IconNode { viewBox: string; body: string }

export const lucideIcons = {
  'brain-circuit': { viewBox: '0 0 24 24', body: "<path d=\"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z\"></path><path d=\"M9 13a4.5 4.5 0 0 0 3-4\"></path><path d=\"M6.003 5.125A3 3 0 0 0 6.401 6.5\"></path><path d=\"M3.477 10.896a4 4 0 0 1 .585-.396\"></path><path d=\"M6 18a4 4 0 0 1-1.967-.516\"></path><path d=\"M12 13h4\"></path><path d=\"M12 18h6a2 2 0 0 1 2 2v1\"></path><path d=\"M12 8h8\"></path><path d=\"M16 8V5a2 2 0 0 1 2-2\"></path><circle cx=\"16\" cy=\"13\" r=\".5\"></circle><circle cx=\"18\" cy=\"3\" r=\".5\"></circle><circle cx=\"20\" cy=\"21\" r=\".5\"></circle><circle cx=\"20\" cy=\"8\" r=\".5\"></circle>" },
  'chart-scatter': { viewBox: '0 0 24 24', body: "<circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"></circle><circle cx=\"18.5\" cy=\"5.5\" r=\".5\" fill=\"currentColor\"></circle><circle cx=\"11.5\" cy=\"11.5\" r=\".5\" fill=\"currentColor\"></circle><circle cx=\"7.5\" cy=\"16.5\" r=\".5\" fill=\"currentColor\"></circle><circle cx=\"17.5\" cy=\"14.5\" r=\".5\" fill=\"currentColor\"></circle><path d=\"M3 3v16a2 2 0 0 0 2 2h16\"></path>" },
  'server': { viewBox: '0 0 24 24', body: "<rect width=\"20\" height=\"8\" x=\"2\" y=\"2\" rx=\"2\" ry=\"2\"></rect><rect width=\"20\" height=\"8\" x=\"2\" y=\"14\" rx=\"2\" ry=\"2\"></rect><line x1=\"6\" x2=\"6.01\" y1=\"6\" y2=\"6\"></line><line x1=\"6\" x2=\"6.01\" y1=\"18\" y2=\"18\"></line>" },
  'code-xml': { viewBox: '0 0 24 24', body: "<path d=\"m18 16 4-4-4-4\"></path><path d=\"m6 8-4 4 4 4\"></path><path d=\"m14.5 4-5 16\"></path>" },
  'network': { viewBox: '0 0 24 24', body: "<rect x=\"16\" y=\"16\" width=\"6\" height=\"6\" rx=\"1\"></rect><rect x=\"2\" y=\"16\" width=\"6\" height=\"6\" rx=\"1\"></rect><rect x=\"9\" y=\"2\" width=\"6\" height=\"6\" rx=\"1\"></rect><path d=\"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3\"></path><path d=\"M12 12V8\"></path>" },
  'graduation-cap': { viewBox: '0 0 24 24', body: "<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\"></path><path d=\"M22 10v6\"></path><path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\"></path>" },
  'mail': { viewBox: '0 0 24 24', body: "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"></rect><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"></path>" },
  'arrow-left': { viewBox: '0 0 24 24', body: "<path d=\"m12 19-7-7 7-7\"></path><path d=\"M19 12H5\"></path>" },
  'arrow-up-left': { viewBox: '0 0 24 24', body: "<path d=\"M7 17V7h10\"></path><path d=\"M17 17 7 7\"></path>" },
  'menu': { viewBox: '0 0 24 24', body: "<line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\"></line><line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\"></line><line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\"></line>" },
  'x': { viewBox: '0 0 24 24', body: "<path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path>" },
  'book-open': { viewBox: '0 0 24 24', body: "<path d=\"M12 7v14\"></path><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\"></path>" },
  'clock': { viewBox: '0 0 24 24', body: "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>" },
  'calendar': { viewBox: '0 0 24 24', body: "<path d=\"M8 2v4\"></path><path d=\"M16 2v4\"></path><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"></rect><path d=\"M3 10h18\"></path>" },
  'copy': { viewBox: '0 0 24 24', body: "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"></rect><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"></path>" },
  'check': { viewBox: '0 0 24 24', body: "<path d=\"M20 6 9 17l-5-5\"></path>" },
  'pen-line': { viewBox: '0 0 24 24', body: "<path d=\"M12 20h9\"></path><path d=\"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z\"></path>" },
  'layers': { viewBox: '0 0 24 24', body: "<path d=\"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z\"></path><path d=\"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65\"></path><path d=\"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65\"></path>" },
  'workflow': { viewBox: '0 0 24 24', body: "<rect width=\"8\" height=\"8\" x=\"3\" y=\"3\" rx=\"2\"></rect><path d=\"M7 11v4a2 2 0 0 0 2 2h4\"></path><rect width=\"8\" height=\"8\" x=\"13\" y=\"13\" rx=\"2\"></rect>" },
  'sparkles': { viewBox: '0 0 24 24', body: "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\"></path><path d=\"M20 3v4\"></path><path d=\"M22 5h-4\"></path><path d=\"M4 17v2\"></path><path d=\"M5 18H3\"></path>" },
  'globe': { viewBox: '0 0 24 24', body: "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"></path><path d=\"M2 12h20\"></path>" },
  'link': { viewBox: '0 0 24 24', body: "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>" },
  'library': { viewBox: '0 0 24 24', body: "<path d=\"m16 6 4 14\"></path><path d=\"M12 6v14\"></path><path d=\"M8 8v12\"></path><path d=\"M4 4v16\"></path>" },
  'arrow-up': { viewBox: '0 0 24 24', body: "<path d=\"m5 12 7-7 7 7\"></path><path d=\"M12 19V5\"></path>" },
  'chevron-left': { viewBox: '0 0 24 24', body: "<path d=\"m15 18-6-6 6-6\"></path>" },
  'chevron-right': { viewBox: '0 0 24 24', body: "<path d=\"m9 18 6-6-6-6\"></path>" },
  'plus': { viewBox: '0 0 24 24', body: "<path d=\"M5 12h14\"></path><path d=\"M12 5v14\"></path>" },
  'minus': { viewBox: '0 0 24 24', body: "<path d=\"M5 12h14\"></path>" },
  'folder-open': { viewBox: '0 0 24 24', body: "<path d=\"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2\"></path>" },
  'external-link': { viewBox: '0 0 24 24', body: "<path d=\"M15 3h6v6\"></path><path d=\"M10 14 21 3\"></path><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path>" },
  'handshake': { viewBox: '0 0 24 24', body: "<path d=\"m11 17 2 2a1 1 0 1 0 3-3\"></path><path d=\"m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4\"></path><path d=\"m21 3 1 11h-2\"></path><path d=\"M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3\"></path><path d=\"M3 4h8\"></path>" },
} as const satisfies Record<string, IconNode>;

export type LucideName = keyof typeof lucideIcons;
