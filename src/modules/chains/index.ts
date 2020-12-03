import type { Coin } from '../coins';

const CHAINS = ['bitcoin', 'ethereum', 'binance'] as const;
export type Chain = typeof CHAINS[number];

export const getChainFor = ({ coin }: { coin: Coin }): Chain => {
  switch (coin) {
    case 'BTCB':
      return 'binance';
    case 'BTC':
      return 'bitcoin';
    case 'BTCE':
    case 'WBTC':
      return 'ethereum';
  }
};
