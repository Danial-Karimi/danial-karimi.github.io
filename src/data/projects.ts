import type { Project } from '@/types/content';

/**
 * EMPTY ON PURPOSE — no finalized projects are ready to be shown publicly yet.
 * Nothing here is a placeholder. When a project is ready, add an entry and the homepage section
 * switches from its empty state to a list automatically.
 *
 * Example shape (only use real URLs):
 * { id: 'my-project', title: '…', description: '…', tags: ['Python'], repoUrl: 'https://github.com/…' }
 */
export const projects: Project[] = [];
