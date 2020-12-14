import type { SkybridgeCoin } from '../coins';

const CHAINS = ['bitcoin', 'ethereum', 'binance'] as const;
export type Chain = typeof CHAINS[number];

export const getChainFor = ({ coin }: { coin: SkybridgeCoin | 'sbBTC' }): Chain => {
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
