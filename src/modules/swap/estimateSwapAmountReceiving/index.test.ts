import type { SkybridgeCoin } from '../../coins';
import { buildContext } from '../../context';
import type { SkybridgeMode } from '../../modes';

import { estimateSwapAmountReceiving } from '.';

jest.mock('../../context/buildContext');

it.each<
  [
    {
      amountDesired: string;
      currencyDeposit: SkybridgeCoin<'swap'>;
      currencyReceiving: SkybridgeCoin<'swap'>;
    },
    any,
  ]
>([
  // [
  //   { amountDesired: '1', currencyDeposit: 'BTC', currencyReceiving: 'BTCB' },
  //   {
  //     amountReceiving: '0.998995',
  //     feeBridgePercent: '0.001',
  //     feeMiner: '0.000005',
  //     feeCurrency: 'BTCB',
  //     feeTotal: '0.001005',
  //   },
  // ],
  [
    { amountDesired: '3', currencyDeposit: 'BTC', currencyReceiving: 'WBTC' },
    {
      amountReceiving: '2.99375',
      feeBridgePercent: '0.002',
      feeMiner: '0.00025',
      feeCurrency: 'WBTC',
      feeTotal: '0.00625',
    },
  ],
  [
    { amountDesired: '156', currencyDeposit: 'WBTC', currencyReceiving: 'BTC' },
    {
      amountReceiving: '155.6877',
      feeBridgePercent: '0.002',
      feeMiner: '0.0003',
      feeCurrency: 'BTC',
      feeTotal: '0.3123',
    },
  ],
])('works for %O', async ({ amountDesired, currencyDeposit, currencyReceiving }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await estimateSwapAmountReceiving({
    context,
    currencyDeposit,
    currencyReceiving,
    amountDesired,
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
    await estimateSwapAmountReceiving({
      context,
      currencyDeposit,
      currencyReceiving,
      amountDesired: '1',
    });
  } catch (e) {
    expect(e.message).toMatch(/Could not find (test|production) bridge for/);
  }
});
