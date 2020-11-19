const NETWORKS = ['ethereum', 'binance'] as const;
export type Network = typeof NETWORKS[number];
