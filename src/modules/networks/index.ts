const NETWORKS = ['ethereum', 'binance', 'bitcoin'] as const;
export type Network = typeof NETWORKS[number];
