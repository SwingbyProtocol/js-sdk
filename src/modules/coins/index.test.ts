import type { SkybridgeResource } from '../resources';
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
    resource?: SkybridgeResource;
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
    { resource: 'swap', expected: ['BTC', 'WBTC', 'BTCB'] },
    { resource: 'pool', expected: ['BTC', 'WBTC', 'sbBTC'] },
    { resource: 'withdrawal', expected: ['sbBTC', 'BTC', 'WBTC'] },
    { resource: 'pool', direction: 'in', expected: ['BTC', 'WBTC'] },
    { resource: 'pool', direction: 'out', expected: ['sbBTC'] },
    { resource: 'withdrawal', direction: 'in', expected: ['sbBTC'] },
    { resource: 'withdrawal', direction: 'out', expected: ['BTC', 'WBTC'] },
  ])('works for %O', async ({ mode, bridge, resource, direction, expected }) => {
    expect.assertions(1);

    expect(
      getCoinsFor({
        context: mode ? await buildContext({ mode }) : undefined,
        bridge,
        resource,
        direction,
      }),
    ).toEqual(expected);
  });
});

describe('getBridgesForCoin()', () => {
  it.each<{
    mode?: SkybridgeMode;
    resource?: SkybridgeResource;
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
    { mode: 'production', resource: 'pool', coin: 'sbBTC', expected: ['btc_erc'] },
    { mode: 'production', resource: 'pool', coin: 'BTCB', expected: [] },
  ])('works for %O', async ({ mode, coin, direction, resource, expected }) => {
    expect.assertions(1);

    expect(
      getBridgesForCoin({
        context: mode ? await buildContext({ mode }) : undefined,
        resource,
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
    resource: SkybridgeResource;
    expected: any;
  }>([
    { mode: 'test', resource: 'swap', coin: 'BTC', expected: ['WBTC', 'BTCB'] },
    { mode: 'production', resource: 'swap', coin: 'BTC', expected: ['WBTC'] },
    { mode: 'test', resource: 'swap', coin: 'BTCB', expected: ['BTC'] },
    { mode: 'production', resource: 'swap', coin: 'BTCB', expected: [] },
    { mode: 'test', resource: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'production', resource: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'production', resource: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'test', resource: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'test', resource: 'swap', coin: 'BTC', expected: ['WBTC', 'BTCB'] },
    { mode: 'test', resource: 'swap', coin: 'BTC', bridge: 'btc_erc', expected: ['WBTC'] },
    { mode: 'test', resource: 'pool', coin: 'WBTC', expected: ['sbBTC'] },
    { mode: 'test', resource: 'withdrawal', coin: 'WBTC', expected: [] },
    { mode: 'test', resource: 'withdrawal', coin: 'sbBTC', expected: ['BTC', 'WBTC'] },
  ])('works for %O', async ({ mode, bridge, coin, resource, expected }) => {
    expect.assertions(1);

    const context = await buildContext({ mode });
    expect(getSwapableWith({ context, bridge, coin, resource })).toEqual(expected);
  });
});