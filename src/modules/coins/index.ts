import type { SkybridgeMode } from '../modes';
import type { SkybridgeBridge } from '../bridges';
import type { SkybridgeResource } from '../resources';
import type { SkybridgeDirection } from '../directions';

const COINS = {
  swap: {
    btc_erc: {
      test: { in: ['BTC', 'WBTC'], out: ['BTC', 'WBTC'] },
      production: { in: ['BTC', 'WBTC'], out: ['BTC', 'WBTC'] },
    },
    btc_bep: {
      test: { in: ['BTC', 'BTCB'], out: ['BTC', 'BTCB'] },
      production: { in: [], out: [] },
    },
  },
  pool: {
    btc_erc: {
      test: { in: ['BTC', 'WBTC'], out: ['sbBTC'] },
      production: { in: ['BTC', 'WBTC'], out: ['sbBTC'] },
    },
    btc_bep: {
      test: { in: [], out: [] },
      production: { in: [], out: [] },
    },
  },
  withdrawal: {
    btc_erc: {
      test: { in: ['sbBTC'], out: ['BTC', 'WBTC'] },
      production: { in: ['sbBTC'], out: ['BTC', 'WBTC'] },
    },
    btc_bep: {
      test: { in: [], out: [] },
      production: { in: [], out: [] },
    },
  },
} as const;

export type SkybridgeCoin<
  A extends SkybridgeResource = SkybridgeResource,
  M extends SkybridgeMode = SkybridgeMode,
  D extends SkybridgeDirection = SkybridgeDirection,
  B extends SkybridgeBridge = SkybridgeBridge
> = typeof COINS[A][B][M][D][number];

const typedKeys = <T>(obj: T): Array<keyof T> => Object.keys(obj) as Array<keyof T>;

export const getCoinsFor = <
  A extends SkybridgeResource,
  M extends SkybridgeMode,
  D extends SkybridgeDirection,
  B extends SkybridgeBridge
>({
  context: { mode } = {},
  bridge,
  direction,
  action,
}: {
  context?: { mode?: M };
  bridge?: B;
  direction?: D;
  action?: A;
} = {}): SkybridgeCoin<A, M, D, B>[] => {
  const result: SkybridgeCoin<A, M, D, B>[] = [];

  typedKeys(COINS).forEach((actionIt) => {
    typedKeys(COINS[actionIt]).forEach((bridgeIt) => {
      typedKeys(COINS[actionIt][bridgeIt]).forEach((modeIt) => {
        typedKeys(COINS[actionIt][bridgeIt][modeIt]).forEach((directionIt) => {
          if (action && action !== actionIt) return;
          if (bridge && bridge !== bridgeIt) return;
          if (mode && mode !== modeIt) return;
          if (direction && direction !== directionIt) return;

          result.push(...COINS[actionIt][bridgeIt][modeIt][directionIt]);
        });
      });
    });
  });

  return Array.from(new Set(result));
};

export const getBridgesForCoin = <
  A extends SkybridgeResource,
  M extends SkybridgeMode,
  D extends SkybridgeDirection
>({
  context: { mode } = {},
  coin,
  direction,
  action,
}: {
  context?: { mode?: M };
  coin: SkybridgeCoin;
  direction?: D;
  action?: A;
}): SkybridgeBridge[] => {
  const result = new Set<SkybridgeBridge>();

  typedKeys(COINS).forEach((actionIt) => {
    typedKeys(COINS[actionIt]).forEach((bridgeIt) => {
      typedKeys(COINS[actionIt][bridgeIt]).forEach((modeIt) => {
        typedKeys(COINS[actionIt][bridgeIt][modeIt]).forEach((directionIt) => {
          if (action && action !== actionIt) return;
          if (mode && mode !== modeIt) return;
          if (direction && direction !== directionIt) return;

          if (
            ((COINS[actionIt][bridgeIt][modeIt][directionIt] as unknown) as string[]).includes(coin)
          ) {
            result.add(bridgeIt);
          }
        });
      });
    });
  });

  return Array.from(result);
};

export const getSwapableWith = <
  A extends SkybridgeResource,
  M extends SkybridgeMode,
  B extends SkybridgeBridge
>({
  context: { mode },
  coin,
  bridge,
  action,
}: {
  context: { mode: M };
  coin: SkybridgeCoin;
  bridge?: B;
  action: A;
}): SkybridgeCoin<A, M, 'out', B>[] => {
  const result: SkybridgeCoin<A, M, 'out', B>[] = [];

  typedKeys(COINS).forEach((actionIt) => {
    typedKeys(COINS[actionIt]).forEach((bridgeIt) => {
      typedKeys(COINS[actionIt][bridgeIt]).forEach((modeIt) => {
        if (action && action !== actionIt) return;
        if (bridge && bridge !== bridgeIt) return;
        if (mode && mode !== modeIt) return;

        if (((COINS[actionIt][bridgeIt][modeIt].in as unknown) as string[]).includes(coin)) {
          result.push(...COINS[actionIt][bridgeIt][modeIt].out);
        }
      });
    });
  });

  const set = new Set(result);
  set.delete(coin as any);

  return Array.from(set);
};
