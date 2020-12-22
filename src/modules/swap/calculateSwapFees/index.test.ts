import type { SkybridgeCoin } from '../../coins';
import { buildContext } from '../../context';
import type { SkybridgeMode } from '../../modes';

import { calculateSwapFees } from './';

jest.mock('../../context/buildContext');

it.each<[{ currencyDeposit: SkybridgeCoin<'swap'>; currencyOut: SkybridgeCoin<'swap'> }, any]>([
  // [
  //   { currencyDeposit: 'BTC', currencyOut: 'BTCB' },
  //   { feeBridgePercent: '0.001', feeMiner: '0.000005', feeCurrency: 'BTCB' },
  // ],
  [
    { currencyDeposit: 'BTC', currencyOut: 'WBTC' },
    { feeBridgePercent: '0.002', feeMiner: '0.00025', feeCurrency: 'WBTC' },
  ],
  [
    { currencyDeposit: 'WBTC', currencyOut: 'BTC' },
    { feeBridgePercent: '0.002', feeMiner: '0.0003', feeCurrency: 'BTC' },
  ],
])('works for %O', async ({ currencyDeposit, currencyOut }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await calculateSwapFees({
    context,
    currencyDeposit,
    currencyOut,
  });

  expect(result).toMatchObject(expected);
});

it.each<{ currencyDeposit: any; mode: SkybridgeMode; currencyOut: any }>([
  { currencyDeposit: 'WBTC', mode: 'test', currencyOut: 'BTCB' },
  { currencyDeposit: 'BTCB', mode: 'test', currencyOut: 'WBTC' },
  { currencyDeposit: 'BTC', mode: 'production', currencyOut: 'BTCB' },
])('throws for %O', async ({ currencyDeposit, mode, currencyOut }) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  try {
    await calculateSwapFees({
      context,
      currencyDeposit,
      currencyOut,
    });
  } catch (e) {
    expect(e.message).toMatch(/Could not find (test|production) bridge for/);
  }
});
