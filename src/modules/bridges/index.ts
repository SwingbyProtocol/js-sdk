export const SKYBRIDGE_BRIDGES = ['btc_erc', 'btc_bep'] as const;
export type SkybridgeBridge = typeof SKYBRIDGE_BRIDGES[number];

export const isSkybridgeBridge = (value: any): value is SkybridgeBridge =>
  SKYBRIDGE_BRIDGES.includes(value);
