import type { SkybridgeCoin } from '../coins';

const CHAINS = ['bitcoin', 'ethereum', 'binance-smart'] as const;
export type SkybridgeChain = typeof CHAINS[number];

export const isSkybridgeChain = (value: any): value is SkybridgeChain => CHAINS.includes(value);

export const getChainFor = ({ coin }: { coin: SkybridgeCoin | 'sbBTC' }): SkybridgeChain => {
  switch (coin) {
    case 'sbBTC.BEP20':
    case 'BTCB.BEP20':
      return 'binance-smart';
    case 'BTC':
      return 'bitcoin';
    case 'sbBTC':
    case 'WBTC':
      return 'ethereum';
  }
};
