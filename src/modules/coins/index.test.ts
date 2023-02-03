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
    { expected: ['BTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    { mode: 'test', expected: ['BTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    { mode: 'production', expected: ['BTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    { mode: 'test', bridge: 'btc_skypool', expected: ['BTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    {
      mode: 'production',
      bridge: 'btc_skypool',
      expected: ['BTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'],
    },
    { resource: 'swap', expected: ['BTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    { resource: 'pool', expected: ['BTC', 'WBTC.SKYPOOL', 'sbBTC.SKYPOOL'] },
    { resource: 'withdrawal', expected: ['BTC', 'sbBTC.SKYPOOL', 'WBTC.SKYPOOL'] },
    { resource: 'pool', direction: 'in', expected: ['BTC', 'WBTC.SKYPOOL'] },
    { resource: 'pool', direction: 'out', expected: ['sbBTC.SKYPOOL'] },
    { resource: 'withdrawal', direction: 'in', expected: ['sbBTC.SKYPOOL'] },
    { resource: 'withdrawal', direction: 'out', expected: ['BTC', 'WBTC.SKYPOOL'] },
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
    expected: SkybridgeBridge[];
  }>([
    { mode: 'test', coin: 'BTC', expected: ['btc_skypool'] },
    { mode: 'production', coin: 'BTC', expected: ['btc_skypool'] },
    { mode: 'test', coin: 'WBTC.SKYPOOL', expected: ['btc_skypool'] },
    { mode: 'production', coin: 'WBTC.SKYPOOL', expected: ['btc_skypool'] },
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
    { mode: 'test', resource: 'swap', coin: 'BTC', expected: ['WBTC.SKYPOOL'] },
    { mode: 'production', resource: 'swap', coin: 'BTC', expected: ['WBTC.SKYPOOL'] },
    { mode: 'test', resource: 'swap', coin: 'WBTC.SKYPOOL', expected: ['BTC'] },
    { mode: 'production', resource: 'swap', coin: 'WBTC.SKYPOOL', expected: ['BTC'] },
    { mode: 'test', resource: 'pool', coin: 'WBTC.SKYPOOL', expected: ['sbBTC.SKYPOOL'] },
    { mode: 'test', resource: 'withdrawal', coin: 'WBTC.SKYPOOL', expected: [] },
    {
      mode: 'test',
      resource: 'withdrawal',
      coin: 'sbBTC.SKYPOOL',
      expected: ['BTC', 'WBTC.SKYPOOL'],
    },
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
      expected: ['WBTC.SKYPOOL', 'sbBTC.SKYPOOL'],
    },
    {
      mode: 'production',
      resource: 'swap',
      coin: 'BTC',
      expected: ['WBTC.SKYPOOL', 'sbBTC.SKYPOOL'],
    },
    { mode: 'test', resource: 'swap', coin: 'WBTC.SKYPOOL', expected: ['BTC', 'sbBTC.SKYPOOL'] },
    {
      mode: 'production',
      resource: 'swap',
      coin: 'WBTC.SKYPOOL',
      expected: ['BTC', 'sbBTC.SKYPOOL'],
    },
    { mode: 'test', resource: 'swap', coin: 'WBTC.SKYPOOL', expected: ['BTC', 'sbBTC.SKYPOOL'] },
    {
      mode: 'production',
      resource: 'swap',
      coin: 'WBTC.SKYPOOL',
      expected: ['BTC', 'sbBTC.SKYPOOL'],
    },
    { mode: 'test', resource: 'pool', coin: 'WBTC.SKYPOOL', expected: [] },
    { mode: 'test', resource: 'withdrawal', coin: 'WBTC.SKYPOOL', expected: ['sbBTC.SKYPOOL'] },
    { mode: 'test', resource: 'withdrawal', coin: 'BTC', expected: ['sbBTC.SKYPOOL'] },
    { mode: 'test', resource: 'withdrawal', coin: 'sbBTC.SKYPOOL', expected: [] },
  ])('works for %O', async ({ mode, bridge, coin, resource, expected }) => {
    expect.assertions(1);

    const context = await buildContext({ mode });
    expect(getSwapableTo({ context, bridge, coin, resource })).toEqual(expected);
  });
});
