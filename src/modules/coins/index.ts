import type { Mode } from '../modes';
import type { Bridge } from '../bridges';
import type { CommonSwapParams } from '../common-params';

const SWAP_COINS = {
  btc_erc: {
    test: ['BTC', 'WBTC'],
    production: ['BTC', 'WBTC'],
  },
  btc_bep: {
    test: ['BTC', 'BTCB'],
    production: [],
  },
} as const;

export type Coin<
  M extends Mode = Mode,
  B extends Bridge = Bridge
> = typeof SWAP_COINS[B][M][number];

export const getCoinsFor = <M extends Mode, B extends Bridge>({
  context: { mode },
  bridge,
}: Pick<CommonSwapParams<M>, 'context'> & {
  bridge?: B;
}): Coin<M, B>[] => {
  if (bridge) {
    return (SWAP_COINS[bridge][mode] as unknown) as Coin<M, B>[];
  }

  const coins: Coin<M>[] = [];

  ((Object.keys(SWAP_COINS) as unknown) as Array<keyof typeof SWAP_COINS>).forEach((bridgeId) => {
    coins.push(...SWAP_COINS[bridgeId][mode]);
  });

  return Array.from(new Set(coins));
};

export const getSwapBridgesFor = <M extends Mode>({
  context: { mode },
  coin,
}: Pick<CommonSwapParams<M>, 'context'> & { coin: Coin<M> }): Bridge[] => {
  const result: Bridge[] = [];

  ((Object.keys(SWAP_COINS) as unknown) as Array<keyof typeof SWAP_COINS>).forEach((bridgeId) => {
    if (((SWAP_COINS[bridgeId][mode] as unknown) as Coin[]).includes(coin)) {
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
  const bridges = getSwapBridgesFor({ context, coin });

  bridges.forEach((bridgeId) => {
    result.push(...SWAP_COINS[bridgeId][context.mode]);
  });

  const set = new Set(result);
  set.delete(coin);

  return Array.from(set);
};
