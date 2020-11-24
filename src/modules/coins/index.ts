import { Mode } from '../modes';
import type { Network } from '../networks';

export const COINS_TEST = ['BTCB', 'BTC', 'BTCE'] as const;
export const COINS_PRODUCTION = ['BTC', 'WBTC'] as const;

export const isEthereumCoin = (symbol: Coin) => ['BTCE', 'WBTC'].includes(symbol);
export const isBinanceCoin = (symbol: Coin) => ['BTCB'].includes(symbol);
export const isBitcoinCoin = (symbol: Coin) => ['BTC'].includes(symbol);

export const getNetworkForCoin = (symbol: Coin): Network | undefined => {
  if (isEthereumCoin(symbol)) {
    return 'ethereum';
  }

  if (isBinanceCoin(symbol)) {
    return 'binance';
  }

  if (isBitcoinCoin(symbol)) {
    return 'bitcoin';
  }

  return undefined;
};

type TestnetCoin = typeof COINS_TEST[number];
type MainnetCoin = typeof COINS_PRODUCTION[number];

export type Coin<M extends Mode | undefined = undefined> = M extends 'test'
  ? TestnetCoin
  : M extends 'production'
  ? MainnetCoin
  : TestnetCoin | MainnetCoin;

export const isTestCoin = (symbol: any): symbol is Coin<'test'> => COINS_TEST.includes(symbol);

export const isProductionCoin = (symbol: any): symbol is Coin<'production'> =>
  COINS_PRODUCTION.includes(symbol);
