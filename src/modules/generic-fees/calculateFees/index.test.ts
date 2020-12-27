import type { SkybridgeCoin } from '../../coins';
import { buildContext } from '../../context';
import type { SkybridgeMode } from '../../modes';
import type { SkybridgeResource } from '../../resources';

import { calculateFees } from './';

jest.mock('../../context/buildContext');

it.each<
  [
    {
      currencyDeposit: SkybridgeCoin<SkybridgeResource, 'test', 'in'>;
      currencyReceiving: SkybridgeCoin<SkybridgeResource, 'test', 'out'>;
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
    { feeBridgePercent: '0.002', feeMiner: '0.00015', feeCurrency: 'WBTC' },
  ],
  [
    { currencyDeposit: 'WBTC', currencyReceiving: 'BTC' },
    { feeBridgePercent: '0.002', feeMiner: '0.00001', feeCurrency: 'BTC' },
  ],
  [
    { currencyDeposit: 'WBTC', currencyReceiving: 'sbBTC' },
    { feeBridgePercent: '0.002', feeMiner: '0.00015', feeCurrency: 'sbBTC' },
  ],
])('works for %O', async ({ currencyDeposit, currencyReceiving }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await calculateFees({
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
    await calculateFees({
      context,
      currencyDeposit,
      currencyReceiving,
    });
  } catch (e) {
    expect(e.message).toMatch(/Could not find (test|production) bridge for/);
  }
});
