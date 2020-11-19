export const MODES = ['test', 'production'] as const;
export type Mode = typeof MODES[number];
