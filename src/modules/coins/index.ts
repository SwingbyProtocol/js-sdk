export const SUPPORTED_COINS = ['BTC', 'BTCE', 'WBTC', 'BTC.B'] as const;
export type Coin = typeof SUPPORTED_COINS[number];

export const isSupportedCoin = (value: any): value is Coin => SUPPORTED_COINS.includes(value);
