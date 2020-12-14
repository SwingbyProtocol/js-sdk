import type { SkybridgeAction } from '../actions';
import type { SkybridgeBridge } from '../bridges';
import { buildContext } from '../context';
import type { SkybridgeDirection } from '../directions';
import type { SkybridgeMode } from '../modes';

import { getBridgesForCoin, getCoinsFor, getSwapableWith, SkybridgeCoin } from './';

jest.mock('../context/buildContext');

describe('getCoinsFor()', () => {
  it.each<{
    mode?: SkybridgeMode;
    bridge?: SkybridgeBridge;
    action?: SkybridgeAction;
    direction?: SkybridgeDirection;
    expected: SkybridgeCoin[];
  }>([
    { expected: ['BTC', 'WBTC', 'BTCB', 'sbBTC'] },
    { mode: 'test', expected: ['BTC', 'WBTC', 'BTCB', 'sbBTC'] },
    { mode: 'production', expected: ['BTC', 'WBTC', 'sbBTC'] },
    { mode: 'test', bridge: 'btc_bep', expected: ['BTC', 'BTCB'] },
    { mode: 'production', bridge: 'btc_bep', expected: [] },
    { mode: 'test', bridge: 'btc_erc', expected: ['BTC', 'WBTC', 'sbBTC'] },
    { mode: 'production', bridge: 'btc_erc', expected: ['BTC', 'WBTC', 'sbBTC'] },
    { action: 'swap', expected: ['BTC', 'WBTC', 'BTCB'] },
    { action: 'float', expected: ['BTC', 'WBTC', 'sbBTC'] },
    { action: 'withdraw', expected: ['sbBTC', 'BTC', 'WBTC'] },
    { action: 'float', direction: 'in', expected: ['BTC', 'WBTC'] },
    { action: 'float', direction: 'out', expected: ['sbBTC'] },
    { action: 'withdraw', direction: 'in', expected: ['sbBTC'] },
    { action: 'withdraw', direction: 'out', expected: ['BTC', 'WBTC'] },
  ])('works for %O', async ({ mode, bridge, action, direction, expected }) => {
    expect.assertions(1);

    expect(
      getCoinsFor({
        context: mode ? await buildContext({ mode }) : undefined,
        bridge,
        action,
        direction,
      }),
    ).toEqual(expected);
  });
});

describe('getBridgesForCoin()', () => {
  it.each<{
    mode?: SkybridgeMode;
    action?: SkybridgeAction;
    direction?: SkybridgeDirection;
    coin: SkybridgeCoin;
    expected: any;
  }>([
    { mode: 'test', coin: 'BTC', expected: ['btc_erc', 'btc_bep'] },
    { mode: 'production', coin: 'BTC', expected: ['btc_erc'] },
    { mode: 'test', coin: 'BTCB', expected: ['btc_bep'] },
    { mode: 'production', coin: 'BTCB', expected: [] },
    { mode: 'test', coin: 'WBTC', expected: ['btc_erc'] },
    { mode: 'production', coin: 'WBTC', expected: ['btc_erc'] },
    { mode: 'production', action: 'float', coin: 'sbBTC', expected: ['btc_erc'] },
    { mode: 'production', action: 'float', coin: 'BTCB', expected: [] },
  ])('works for %O', async ({ mode, coin, direction, action, expected }) => {
    expect.assertions(1);

    expect(
      getBridgesForCoin({
        context: mode ? await buildContext({ mode }) : undefined,
        action,
        direction,
        coin,
      }),
    ).toEqual(expected);
  });
});

describe('getSwapableWith()', () => {
  it.each<{
    mode: SkybridgeMode;
    bridge?: SkybridgeBridge;
    coin: SkybridgeCoin;
    action: SkybridgeAction;
    expected: any;
  }>([
    { mode: 'test', action: 'swap', coin: 'BTC', expected: ['WBTC', 'BTCB'] },
    { mode: 'production', action: 'swap', coin: 'BTC', expected: ['WBTC'] },
    { mode: 'test', action: 'swap', coin: 'BTCB', expected: ['BTC'] },
    { mode: 'production', action: 'swap', coin: 'BTCB', expected: [] },
    { mode: 'test', action: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'production', action: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'production', action: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'test', action: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'test', action: 'swap', coin: 'BTC', expected: ['WBTC', 'BTCB'] },
    { mode: 'test', action: 'swap', coin: 'BTC', bridge: 'btc_erc', expected: ['WBTC'] },
    { mode: 'test', action: 'float', coin: 'WBTC', expected: ['sbBTC'] },
    { mode: 'test', action: 'withdraw', coin: 'WBTC', expected: [] },
    { mode: 'test', action: 'withdraw', coin: 'sbBTC', expected: ['BTC', 'WBTC'] },
  ])('works for %O', async ({ mode, bridge, coin, action, expected }) => {
    expect.assertions(1);

    const context = await buildContext({ mode });
    expect(getSwapableWith({ context, bridge, coin, action })).toEqual(expected);
  });
});
