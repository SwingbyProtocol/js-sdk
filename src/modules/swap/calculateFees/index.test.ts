import type { Coin } from '../../coins';
import { buildContext } from '../../context';
import { Mode } from '../../modes';

import { calculateFees } from './';

jest.mock('../../context/buildContext');

it.each<[{ currencyIn: Coin<'test'>; currencyOut: Coin<'test'> }, any]>([
  [
    { currencyIn: 'BTC', currencyOut: 'BTCB' },
    { feeBridgePercent: '0.001', feeMiner: '0.000005', feeCurrency: 'BTCB' },
  ],
  [
    { currencyIn: 'BTC', currencyOut: 'WBTC' },
    { feeBridgePercent: '0.001', feeMiner: '0', feeCurrency: 'WBTC' },
  ],
  [
    { currencyIn: 'WBTC', currencyOut: 'BTC' },
    { feeBridgePercent: '0.001', feeMiner: '0.0003', feeCurrency: 'BTC' },
  ],
])('works for %O', async ({ currencyIn, currencyOut }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await calculateFees({
    context,
    currencyIn,
    currencyOut,
  });

  expect(result).toMatchObject(expected);
});

it.each<{ currencyIn: Coin; mode: Mode; currencyOut: Coin }>([
  { currencyIn: 'WBTC', mode: 'test', currencyOut: 'BTCB' },
  { currencyIn: 'BTC', mode: 'test', currencyOut: 'WBTC' },
  { currencyIn: 'BTC', mode: 'production', currencyOut: 'WBTC' },
])('throws for %O', async ({ currencyIn, mode, currencyOut }) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  try {
    await calculateFees({
      context,
      currencyIn,
      currencyOut,
    });
  } catch (e) {
    expect(e.message).toMatch(/Could not find (test|production) bridge for/);
  }
});
