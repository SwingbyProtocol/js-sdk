import type { SkybridgeCoin } from '../../coins';
import { buildContext } from '../../context';
import type { SkybridgeMode } from '../../modes';

import { calculateSwapFees } from './';

jest.mock('../../context/buildContext');

it.each<
  [
    {
      currencyDeposit: SkybridgeCoin<'swap', 'test', 'in'>;
      currencyReceiving: SkybridgeCoin<'swap', 'test', 'out'>;
    },
    any,
  ]
>([
  // [
  //   { currencyDeposit: 'BTC', currencyReceiving: 'BTCB' },
  //   { feeBridgePercent: '0.001', feeMiner: '0.000005', feeCurrency: 'BTCB' },
  // ],
  [
    { currencyDeposit: 'BTC', currencyReceiving: 'WBTC' },
    { feeBridgePercent: '0.002', feeMiner: '0.00025', feeCurrency: 'WBTC' },
  ],
  [
    { currencyDeposit: 'WBTC', currencyReceiving: 'BTC' },
    { feeBridgePercent: '0.002', feeMiner: '0.0003', feeCurrency: 'BTC' },
  ],
])('works for %O', async ({ currencyDeposit, currencyReceiving }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await calculateSwapFees({
    context,
    currencyDeposit,
    currencyReceiving,
  });

  expect(result).toMatchObject(expected);
});

it.each<{ currencyDeposit: any; mode: SkybridgeMode; currencyReceiving: any }>([
  { currencyDeposit: 'WBTC', mode: 'test', currencyReceiving: 'BTCB' },
  { currencyDeposit: 'BTCB', mode: 'test', currencyReceiving: 'WBTC' },
  { currencyDeposit: 'BTC', mode: 'production', currencyReceiving: 'BTCB' },
])('throws for %O', async ({ currencyDeposit, mode, currencyReceiving }) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  try {
    await calculateSwapFees({
      context,
      currencyDeposit,
      currencyReceiving,
    });
  } catch (e) {
    expect(e.message).toMatch(/Could not find (test|production) bridge for/);
  }
});
