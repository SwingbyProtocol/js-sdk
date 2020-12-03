import type { Mode } from '../modes';
import type { Bridge } from '../bridges';
import type { CommonSwapParams } from '../swap-params';

const COINS = {
  btc_erc: {
    test: ['BTC', 'BTCE'],
    production: ['BTC', 'WBTC'],
  },
  btc_bep: {
    test: ['BTC', 'BTCB'],
    production: [],
  },
} as const;

export type Coin<M extends Mode = Mode, B extends Bridge = Bridge> = typeof COINS[B][M][number];

export const getCoinsFor = <M extends Mode, B extends Bridge>({
  context: { mode },
  bridge,
}: Pick<CommonSwapParams<M>, 'context'> & {
  bridge?: B;
}) => {
  if (bridge) {
    return COINS[bridge][mode];
  }

  const coins: Coin<M>[] = [];

  ((Object.keys(COINS) as unknown) as Array<keyof typeof COINS>).forEach((bridgeId) => {
    coins.push(...COINS[bridgeId][mode]);
  });

  return Array.from(new Set(coins));
};

export const getBridgesFor = <M extends Mode>({
  context: { mode },
  coin,
}: Pick<CommonSwapParams<M>, 'context'> & { coin: Coin }): Bridge[] => {
  const result: Bridge[] = [];

  ((Object.keys(COINS) as unknown) as Array<keyof typeof COINS>).forEach((bridgeId) => {
    if (((COINS[bridgeId][mode] as unknown) as Coin[]).includes(coin)) {
      result.push(bridgeId);
    }
  });

  return result;
};

export const getSwapableWith = <M extends Mode>({
  context,
  coin,
}: Pick<CommonSwapParams<M>, 'context'> & {
  coin: Coin;
}): Coin<M>[] => {
  const result: Coin<M>[] = [];
  const bridges = getBridgesFor({ context, coin });

  bridges.forEach((bridgeId) => {
    result.push(...COINS[bridgeId][context.mode]);
  });

  const set = new Set(result);
  set.delete(coin);

  return Array.from(set);
};
