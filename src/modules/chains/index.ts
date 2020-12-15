import type { SkybridgeCoin } from '../coins';

const CHAINS = ['bitcoin', 'ethereum', 'binance'] as const;
export type SkybridgeChain = typeof CHAINS[number];

export const isSkybridgeChain = (value: any): value is SkybridgeChain => CHAINS.includes(value);

export const getChainFor = ({ coin }: { coin: SkybridgeCoin | 'sbBTC' }): SkybridgeChain => {
  switch (coin) {
    case 'BTCB':
      return 'binance';
    case 'BTC':
      return 'bitcoin';
    case 'sbBTC':
    case 'WBTC':
      return 'ethereum';
  }
};
