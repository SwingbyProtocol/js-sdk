import type { SkybridgeResource } from '../resources';
import type { SkybridgeBridge } from '../bridges';
import { buildContext } from '../context';
import type { SkybridgeDirection } from '../directions';
import type { SkybridgeMode } from '../modes';

import { getBridgesForCoin, getCoinsFor, getSwapableFrom, getSwapableTo, SkybridgeCoin } from './';

jest.mock('../context/buildContext');

describe('getCoinsFor()', () => {
  it.each<{
    mode?: SkybridgeMode;
    bridge?: SkybridgeBridge;
    resource?: SkybridgeResource;
    direction?: SkybridgeDirection;
    expected: SkybridgeCoin[];
  }>([
    { expected: ['BTC', 'WBTC', 'sbBTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    { mode: 'test', expected: ['BTC', 'WBTC', 'sbBTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    { mode: 'production', expected: ['BTC', 'WBTC', 'sbBTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    { mode: 'test', bridge: 'btc_skypool', expected: ['BTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    {
      mode: 'production',
      bridge: 'btc_skypool',
      expected: ['BTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'],
    },
    { mode: 'test', bridge: 'btc_erc', expected: ['BTC', 'WBTC', 'sbBTC'] },
    { mode: 'production', bridge: 'btc_erc', expected: ['BTC', 'WBTC', 'sbBTC'] },
    { resource: 'swap', expected: ['BTC', 'WBTC', 'sbBTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    { resource: 'pool', expected: ['BTC', 'WBTC', 'sbBTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    { resource: 'withdrawal', expected: ['sbBTC', 'BTC', 'WBTC', 'sbBTC.SKYPOOL', 'WBTC.SKYPOOL'] },
    { resource: 'pool', direction: 'in', expected: ['BTC', 'WBTC', 'WBTC.SKYPOOL'] },
    { resource: 'pool', direction: 'out', expected: ['sbBTC', 'sbBTC.SKYPOOL'] },
    { resource: 'withdrawal', direction: 'in', expected: ['sbBTC', 'sbBTC.SKYPOOL'] },
    { resource: 'withdrawal', direction: 'out', expected: ['BTC', 'WBTC', 'WBTC.SKYPOOL'] },
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
    { mode: 'test', coin: 'BTC', expected: ['btc_erc', 'btc_skypool'] },
    { mode: 'production', coin: 'BTC', expected: ['btc_erc', 'btc_skypool'] },
    { mode: 'test', coin: 'WBTC.SKYPOOL', expected: ['btc_skypool'] },
    { mode: 'production', coin: 'WBTC.SKYPOOL', expected: ['btc_skypool'] },
    { mode: 'test', coin: 'WBTC', expected: ['btc_erc'] },
    { mode: 'production', coin: 'WBTC', expected: ['btc_erc'] },
    { mode: 'production', resource: 'pool', coin: 'sbBTC', expected: ['btc_erc'] },
    { mode: 'production', resource: 'pool', coin: 'WBTC.SKYPOOL', expected: ['btc_skypool'] },
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

describe('getSwapableFrom()', () => {
  it.each<{
    mode: SkybridgeMode;
    bridge?: SkybridgeBridge;
    coin: SkybridgeCoin;
    resource: SkybridgeResource;
    expected: SkybridgeCoin[];
  }>([
    { mode: 'test', resource: 'swap', coin: 'BTC', expected: ['WBTC', 'WBTC.SKYPOOL'] },
    { mode: 'production', resource: 'swap', coin: 'BTC', expected: ['WBTC', 'WBTC.SKYPOOL'] },
    { mode: 'test', resource: 'swap', coin: 'WBTC.SKYPOOL', expected: ['BTC'] },
    { mode: 'production', resource: 'swap', coin: 'WBTC.SKYPOOL', expected: ['BTC'] },
    { mode: 'test', resource: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'production', resource: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'production', resource: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'test', resource: 'swap', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'test', resource: 'swap', coin: 'BTC', bridge: 'btc_erc', expected: ['WBTC'] },
    { mode: 'test', resource: 'pool', coin: 'WBTC', expected: ['sbBTC'] },
    { mode: 'test', resource: 'withdrawal', coin: 'WBTC', expected: [] },
    { mode: 'test', resource: 'withdrawal', coin: 'sbBTC', expected: ['BTC', 'WBTC'] },
  ])('works for %O', async ({ mode, bridge, coin, resource, expected }) => {
    expect.assertions(1);

    const context = await buildContext({ mode });
    expect(getSwapableFrom({ context, bridge, coin, resource })).toEqual(expected);
  });
});

describe('getSwapableTo()', () => {
  it.each<{
    mode: SkybridgeMode;
    bridge?: SkybridgeBridge;
    coin: SkybridgeCoin;
    resource: SkybridgeResource;
    expected: SkybridgeCoin[];
  }>([
    {
      mode: 'test',
      resource: 'swap',
      coin: 'BTC',
      expected: ['WBTC', 'sbBTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'],
    },
    {
      mode: 'production',
      resource: 'swap',
      coin: 'BTC',
      expected: ['WBTC', 'sbBTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'],
    },
    { mode: 'test', resource: 'swap', coin: 'WBTC.SKYPOOL', expected: ['BTC', 'sbBTC.SKYPOOL'] },
    {
      mode: 'production',
      resource: 'swap',
      coin: 'WBTC.SKYPOOL',
      expected: ['BTC', 'sbBTC.SKYPOOL'],
    },
    { mode: 'test', resource: 'swap', coin: 'WBTC', expected: ['BTC', 'sbBTC'] },
    { mode: 'production', resource: 'swap', coin: 'WBTC', expected: ['BTC', 'sbBTC'] },
    { mode: 'test', resource: 'swap', coin: 'WBTC', expected: ['BTC', 'sbBTC'] },
    { mode: 'test', resource: 'swap', coin: 'BTC', bridge: 'btc_erc', expected: ['WBTC', 'sbBTC'] },
    { mode: 'test', resource: 'pool', coin: 'WBTC', expected: [] },
    { mode: 'test', resource: 'withdrawal', coin: 'WBTC', expected: ['sbBTC'] },
    { mode: 'test', resource: 'withdrawal', coin: 'WBTC.SKYPOOL', expected: ['sbBTC.SKYPOOL'] },
    { mode: 'test', resource: 'withdrawal', coin: 'BTC', expected: ['sbBTC', 'sbBTC.SKYPOOL'] },
    { mode: 'test', resource: 'withdrawal', coin: 'sbBTC', expected: [] },
  ])('works for %O', async ({ mode, bridge, coin, resource, expected }) => {
    expect.assertions(1);

    const context = await buildContext({ mode });
    expect(getSwapableTo({ context, bridge, coin, resource })).toEqual(expected);
  });
});
