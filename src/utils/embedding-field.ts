/**
 * Deterministic generator for the hero figure: a 2-D "embedding space" with three clusters,
 * a few outliers and one highlighted neighbourhood. Same seed → same SVG on every build.
 */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number): number {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const round = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export interface FieldPoint {
  x: number;
  y: number;
  r: number;
  o: number;
  focus: boolean;
}

export interface FieldCluster {
  id: 'a' | 'b' | 'c';
  points: FieldPoint[];
}

export interface EmbeddingField {
  width: number;
  height: number;
  plot: { left: number; top: number; right: number; bottom: number };
  clusters: FieldCluster[];
  outliers: FieldPoint[];
  lens: { cx: number; cy: number; r: number };
  neighbours: Array<{ x: number; y: number }>;
}

export function createEmbeddingField(seed = 11, width = 480, height = 560): EmbeddingField {
  const rand = mulberry32(seed);
  const plot = { left: 34, top: 34, right: width - 34, bottom: height - 74 };
  const lens = { cx: 156, cy: 206, r: 64 };

  const specs = [
    { id: 'a' as const, cx: 156, cy: 206, spread: 34, count: 46 },
    { id: 'b' as const, cx: 338, cy: 262, spread: 30, count: 38 },
    { id: 'c' as const, cx: 226, cy: 408, spread: 36, count: 42 },
  ];

  const make = (x: number, y: number): FieldPoint => ({
    x: round(clamp(x, plot.left + 6, plot.right - 6)),
    y: round(clamp(y, plot.top + 6, plot.bottom - 6)),
    r: round(1.5 + rand() * 1.9),
    o: round(0.5 + rand() * 0.5),
    focus: false,
  });

  const clusters: FieldCluster[] = specs.map((s) => ({
    id: s.id,
    points: Array.from({ length: s.count }, () =>
      make(s.cx + gaussian(rand) * s.spread, s.cy + gaussian(rand) * s.spread * 1.1),
    ),
  }));

  const outliers = Array.from({ length: 20 }, () => {
    const p = make(plot.left + rand() * (plot.right - plot.left), plot.top + rand() * (plot.bottom - plot.top));
    p.o = round(0.25 + rand() * 0.3);
    return p;
  });

  const dist = (p: FieldPoint) => Math.hypot(p.x - lens.cx, p.y - lens.cy);
  for (const p of clusters.flatMap((c) => c.points)) p.focus = dist(p) < lens.r - 4;

  const neighbours = clusters
    .flatMap((c) => c.points)
    .sort((p, q) => dist(p) - dist(q))
    .slice(0, 6)
    .map((p) => ({ x: p.x, y: p.y }));

  return { width, height, plot, clusters, outliers, lens, neighbours };
}
