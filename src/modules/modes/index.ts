export const MODES = ['test', 'production'] as const;
export type SkybridgeMode = typeof MODES[number];

export const isSkybridgeMode = (value: any): value is SkybridgeMode => MODES.includes(value);
