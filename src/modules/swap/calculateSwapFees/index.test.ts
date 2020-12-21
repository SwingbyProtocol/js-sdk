import type { SkybridgeCoin } from '../../coins';
import { buildContext } from '../../context';
import type { SkybridgeMode } from '../../modes';

import { calculateSwapFees } from './';

jest.mock('../../context/buildContext');

it.each<[{ currencyIn: SkybridgeCoin<'swap'>; currencyOut: SkybridgeCoin<'swap'> }, any]>([
  [
    { currencyIn: 'BTC', currencyOut: 'BTCB' },
    { feeBridgePercent: '0.001', feeMiner: '0.000005', feeCurrency: 'BTCB' },
  ],
  [
    { currencyIn: 'BTC', currencyOut: 'WBTC' },
    { feeBridgePercent: '0.002', feeMiner: '0.00025', feeCurrency: 'WBTC' },
  ],
  [
    { currencyIn: 'WBTC', currencyOut: 'BTC' },
    { feeBridgePercent: '0.002', feeMiner: '0.0003', feeCurrency: 'BTC' },
  ],
])('works for %O', async ({ currencyIn, currencyOut }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await calculateSwapFees({
    context,
    currencyIn,
    currencyOut,
  });

  expect(result).toMatchObject(expected);
});

it.each<{ currencyIn: any; mode: SkybridgeMode; currencyOut: any }>([
  { currencyIn: 'WBTC', mode: 'test', currencyOut: 'BTCB' },
  { currencyIn: 'BTCB', mode: 'test', currencyOut: 'WBTC' },
  { currencyIn: 'BTC', mode: 'production', currencyOut: 'BTCB' },
])('throws for %O', async ({ currencyIn, mode, currencyOut }) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  try {
    await calculateSwapFees({
      context,
      currencyIn,
      currencyOut,
    });
  } catch (e) {
    expect(e.message).toMatch(/Could not find (test|production) bridge for/);
  }
});
