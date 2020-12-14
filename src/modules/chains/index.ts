import type { Coin } from '../coins';

const CHAINS = ['bitcoin', 'ethereum', 'binance'] as const;
export type Chain = typeof CHAINS[number];

export const getChainFor = ({ coin }: { coin: Coin | 'sbBTC' }): Chain => {
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
