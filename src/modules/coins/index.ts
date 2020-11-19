import { Mode } from '../modes';

export const COINS_TEST = ['BTC.B', 'BTC', 'BTCE'] as const;
export const COINS_PRODUCTION = ['BTC', 'WBTC'] as const;

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
