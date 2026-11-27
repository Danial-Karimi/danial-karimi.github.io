import type { LucideName } from '@/assets/icons/lucide';
import type { BrandName } from '@/assets/icons/brands';

/** Any icon the <Icon /> component can draw. */
export type IconName = LucideName | BrandName;

/** Accent roles used across the design system (see styles/tokens.css). */
export type Accent = 'blue' | 'violet' | 'cyan' | 'lavender';

export interface NavItem {
  id: string;
  label: string;
  /** Final route once the dedicated page exists (e.g. "/about/"). */
  page: string;
  /** Anchor of the matching homepage section, if the homepage has one. */
  anchor?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  /** Leave empty to hide the link everywhere. Never put an unverified URL here. */
  url: string;
  icon: IconName;
  /** Human-readable handle shown in "labeled" lists (LTR). */
  handle?: string;
  /** Where the link may appear. */
  placements: Array<'hero' | 'contact' | 'footer'>;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  accent: Accent;
  /** Visual weight on the homepage grid. */
  size: 'xl' | 'lg' | 'md' | 'sm';
  /** Decorative mini-visual drawn inside the tile. */
  visual: 'attention' | 'scatter' | 'lanes' | 'brackets' | 'graph';
}

export interface EducationEntry {
  id: string;
  institution: string;
  program: string;
  /** Free-form, already formatted for display (e.g. "۱۴۰۲ تا ۱۴۰۶"). */
  period?: string;
  description?: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: IconName;
  description?: string;
  /** Optional. Shown as a plain text label — never as a bar or percentage. */
  level?: SkillLevel;
}

export interface Technology {
  id: string;
  /** Latin brand name shown next to the logo. */
  name: string;
  /** Monochrome brand mark from src/assets/icons/brands.ts. */
  icon: BrandName;
}

export interface JourneyStage {
  id: string;
  title: string;
  /** Latin label, shown as a small technical caption. */
  label: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  /** Only real, verified URLs. Leave undefined to hide the link. */
  liveUrl?: string;
  repoUrl?: string;
}
