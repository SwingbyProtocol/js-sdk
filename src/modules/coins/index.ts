import type { SkybridgeMode } from '../modes';
import type { SkybridgeBridge } from '../bridges';
import type { SkybridgeResource } from '../resources';
import type { SkybridgeDirection } from '../directions';

export type SkybridgeApiCoin = 'BTC' | 'WBTC' | 'sbBTC' | 'BTCB' | 'SKYPOOL';

const COINS = {
  swap: {
    btc_erc: {
      test: {
        in: ['BTC', 'WBTC', 'sbBTC'],
        out: ['BTC', 'WBTC'],
      },
      production: {
        in: ['BTC', 'WBTC', 'sbBTC'],
        out: ['BTC', 'WBTC'],
      },
    },
    btc_bep20: {
      test: {
        in: [],
        out: [],
      },
      production: {
        in: ['BTC', 'BTCB.BEP20', 'sbBTC.BEP20'],
        out: ['BTC', 'BTCB.BEP20'],
      },
    },
  },
  pool: {
    btc_erc: {
      test: {
        in: ['BTC', 'WBTC'],
        out: ['sbBTC'],
      },
      production: {
        in: ['BTC', 'WBTC'],
        out: ['sbBTC'],
      },
    },
    btc_bep20: {
      test: {
        in: [],
        out: [],
      },
      production: {
        in: ['BTC', 'BTCB.BEP20'],
        out: ['sbBTC.BEP20'],
      },
    },
  },
  withdrawal: {
    btc_erc: {
      test: {
        in: ['sbBTC'],
        out: ['BTC', 'WBTC'],
      },
      production: {
        in: ['sbBTC'],
        out: ['BTC', 'WBTC'],
      },
    },
    btc_bep20: {
      test: {
        in: ['sbBTC.BEP20'],
        out: ['BTC', 'BTCB.BEP20'],
      },
      production: {
        in: ['sbBTC.BEP20'],
        out: ['BTC', 'BTCB.BEP20'],
      },
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
  resource,
}: {
  context?: { mode?: M };
  bridge?: B;
  direction?: D;
  resource?: A;
} = {}): SkybridgeCoin<A, M, D, B>[] => {
  const result: SkybridgeCoin<A, M, D, B>[] = [];

  typedKeys(COINS).forEach((resourceIt) => {
    typedKeys(COINS[resourceIt]).forEach((bridgeIt) => {
      typedKeys(COINS[resourceIt][bridgeIt]).forEach((modeIt) => {
        typedKeys(COINS[resourceIt][bridgeIt][modeIt]).forEach((directionIt) => {
          if (resource && resource !== resourceIt) return;
          if (bridge && bridge !== bridgeIt) return;
          if (mode && mode !== modeIt) return;
          if (direction && direction !== directionIt) return;
          // if (mode === 'test' && bridge === 'btc_bep20') return;

          result.push(...COINS[resourceIt][bridgeIt][modeIt][directionIt]);
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
  resource,
}: {
  context?: { mode?: M };
  coin: SkybridgeCoin;
  direction?: D;
  resource?: A;
}): SkybridgeBridge[] => {
  const result = new Set<SkybridgeBridge>();

  typedKeys(COINS).forEach((resourceIt) => {
    typedKeys(COINS[resourceIt]).forEach((bridgeIt) => {
      typedKeys(COINS[resourceIt][bridgeIt]).forEach((modeIt) => {
        typedKeys(COINS[resourceIt][bridgeIt][modeIt]).forEach((directionIt) => {
          if (resource && resource !== resourceIt) return;
          if (mode && mode !== modeIt) return;
          if (direction && direction !== directionIt) return;

          if (
            ((COINS[resourceIt][bridgeIt][modeIt][directionIt] as unknown) as string[]).includes(
              coin,
            )
          ) {
            result.add(bridgeIt);
          }
        });
      });
    });
  });

  return Array.from(result);
};

export const getSwapableFrom = <
  A extends SkybridgeResource,
  M extends SkybridgeMode,
  B extends SkybridgeBridge
>({
  context: { mode },
  coin,
  bridge,
  resource,
}: {
  context: { mode: M };
  coin: SkybridgeCoin;
  bridge?: B;
  resource: A;
}): SkybridgeCoin<A, M, 'out', B>[] => {
  const result: SkybridgeCoin<A, M, 'out', B>[] = [];

  typedKeys(COINS).forEach((resourceIt) => {
    typedKeys(COINS[resourceIt]).forEach((bridgeIt) => {
      typedKeys(COINS[resourceIt][bridgeIt]).forEach((modeIt) => {
        if (resource && resource !== resourceIt) return;
        if (bridge && bridge !== bridgeIt) return;
        if (mode && mode !== modeIt) return;

        if (((COINS[resourceIt][bridgeIt][modeIt].in as unknown) as string[]).includes(coin)) {
          result.push(...COINS[resourceIt][bridgeIt][modeIt].out);
        }
      });
    });
  });

  const set = new Set(result);
  set.delete(coin as any);

  return Array.from(set);
};

export const getSwapableTo = <
  A extends SkybridgeResource,
  M extends SkybridgeMode,
  B extends SkybridgeBridge
>({
  context: { mode },
  coin,
  bridge,
  resource,
}: {
  context: { mode: M };
  coin: SkybridgeCoin;
  bridge?: B;
  resource: A;
}): SkybridgeCoin<A, M, 'in', B>[] => {
  const result: SkybridgeCoin<A, M, 'in', B>[] = [];

  typedKeys(COINS).forEach((resourceIt) => {
    typedKeys(COINS[resourceIt]).forEach((bridgeIt) => {
      typedKeys(COINS[resourceIt][bridgeIt]).forEach((modeIt) => {
        if (resource && resource !== resourceIt) return;
        if (bridge && bridge !== bridgeIt) return;
        if (mode && mode !== modeIt) return;

        if (((COINS[resourceIt][bridgeIt][modeIt].out as unknown) as string[]).includes(coin)) {
          result.push(...COINS[resourceIt][bridgeIt][modeIt].in);
        }
      });
    });
  });

  const set = new Set(result);
  set.delete(coin as any);

  return Array.from(set);
};

export const getDisplayNameForCoin = ({ coin }: { coin: SkybridgeCoin }): string => {
  switch (coin) {
    case 'BTC':
      return 'BTC';
    case 'BTCB.BEP20':
      return 'BTCB (BEP20)';
    case 'sbBTC.BEP20':
      return 'sbBTC (BEP20)';
    case 'WBTC':
      return 'WBTC (ERC20)';
    case 'sbBTC':
      return 'sbBTC (ERC20)';
  }
};

export const toApiCoin = ({ coin }: { coin: SkybridgeCoin }): SkybridgeApiCoin => {
  switch (coin) {
    case 'BTC':
      return 'BTC';
    case 'BTCB.BEP20':
      return 'BTCB';
    case 'WBTC':
      return 'WBTC';
    case 'sbBTC.BEP20':
    case 'sbBTC':
      return 'sbBTC';
  }
};

export const fromApiCoin = ({
  coin,
  bridge,
}: {
  coin: SkybridgeApiCoin;
  bridge: SkybridgeBridge;
}): SkybridgeCoin => {
  if (bridge === 'btc_erc') {
    if ((coin as any) === 'BTCE') return 'WBTC';
    if (coin === 'SKYPOOL') return 'WBTC';
    return coin as SkybridgeCoin;
  }

  if (bridge === 'btc_bep20') {
    switch (coin) {
      case 'BTC':
        return 'BTC';
      case 'BTCB':
        return 'BTCB.BEP20';
      case 'sbBTC':
        return 'sbBTC.BEP20';
      case 'SKYPOOL':
        return 'BTCB.BEP20';
    }
  }

  throw new Error(`Could not find SDK coin ID for "${coin}" in bridge "${bridge}"`);
};
