const BRIDGES = ['btc_erc', 'btc_bep'] as const;
export type Bridge = typeof BRIDGES[number];
