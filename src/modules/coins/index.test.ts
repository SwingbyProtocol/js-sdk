import type { Bridge } from '../bridges';
import { buildContext } from '../context';
import type { Mode } from '../modes';

import { Coin, getBridgesFor, getCoinsFor, getSwapableWith } from './';

jest.mock('../context/buildContext');

describe('getCoinsFor()', () => {
  it.each<{ mode: Mode; bridge?: Bridge; expected: any }>([
    { mode: 'test', expected: ['BTC', 'WBTC', 'BTCB'] },
    { mode: 'production', expected: ['BTC', 'WBTC'] },
    { mode: 'test', bridge: 'btc_bep', expected: ['BTC', 'BTCB'] },
    { mode: 'production', bridge: 'btc_bep', expected: [] },
    { mode: 'test', bridge: 'btc_erc', expected: ['BTC', 'WBTC'] },
    { mode: 'production', bridge: 'btc_erc', expected: ['BTC', 'WBTC'] },
  ])('works for %O', async ({ mode, bridge, expected }) => {
    expect.assertions(1);

    const context = await buildContext({ mode });
    expect(getCoinsFor({ context, bridge })).toEqual(expected);
  });
});

describe('getBridgesFor()', () => {
  it.each<{ mode: Mode; coin: Coin; expected: any }>([
    { mode: 'test', coin: 'BTC', expected: ['btc_erc', 'btc_bep'] },
    { mode: 'production', coin: 'BTC', expected: ['btc_erc'] },
    { mode: 'test', coin: 'BTCB', expected: ['btc_bep'] },
    { mode: 'production', coin: 'BTCB', expected: [] },
    { mode: 'test', coin: 'WBTC', expected: ['btc_erc'] },
    { mode: 'production', coin: 'WBTC', expected: ['btc_erc'] },
  ])('works for %O', async ({ mode, coin, expected }) => {
    expect.assertions(1);

    const context = await buildContext({ mode });
    expect(getBridgesFor({ context, coin })).toEqual(expected);
  });
});

describe('getSwapableWith()', () => {
  it.each<{ mode: Mode; coin: Coin; expected: any }>([
    { mode: 'test', coin: 'BTC', expected: ['WBTC', 'BTCB'] },
    { mode: 'production', coin: 'BTC', expected: ['WBTC'] },
    { mode: 'test', coin: 'BTCB', expected: ['BTC'] },
    { mode: 'production', coin: 'BTCB', expected: [] },
    { mode: 'test', coin: 'WBTC', expected: ['BTC'] },
    { mode: 'production', coin: 'WBTC', expected: ['BTC'] },
  ])('works for %O', async ({ mode, coin, expected }) => {
    expect.assertions(1);

    const context = await buildContext({ mode });
    expect(getSwapableWith({ context, coin })).toEqual(expected);
  });
});
