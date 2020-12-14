const BRIDGES = ['btc_erc', 'btc_bep'] as const;
export type SkybridgeBridge = typeof BRIDGES[number];
