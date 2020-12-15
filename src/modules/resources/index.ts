const RESOURCES = ['swap', 'pool', 'withdrawal'] as const;
export type SkybridgeResource = typeof RESOURCES[number];
