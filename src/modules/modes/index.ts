export const MODES = ['test', 'production'] as const;
export type SkybridgeMode = typeof MODES[number];
