const ACTIONS = ['swap', 'float', 'withdraw'] as const;
export type SkybridgeAction = typeof ACTIONS[number];
