const RESOURCES = ['swap', 'pool', 'withdrawal'] as const;
export type SkybridgeResource = typeof RESOURCES[number];

export const isSkybridgeResource = (value: any): value is SkybridgeResource =>
  RESOURCES.includes(value);
