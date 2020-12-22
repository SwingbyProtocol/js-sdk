import type { SkybridgeCoin } from '../../coins';
import { buildContext } from '../../context';
import type { SkybridgeMode } from '../../modes';

import { estimateSwapAmountOut } from './';

jest.mock('../../context/buildContext');

it.each<
  [
    {
      amountDesired: string;
      currencyIn: SkybridgeCoin<'swap'>;
      currencyOut: SkybridgeCoin<'swap'>;
    },
    any,
  ]
>([
  // [
  //   { amountDesired: '1', currencyIn: 'BTC', currencyOut: 'BTCB' },
  //   {
  //     amountReceiving: '0.998995',
  //     feeBridgePercent: '0.001',
  //     feeMiner: '0.000005',
  //     feeCurrency: 'BTCB',
  //     feeTotal: '0.001005',
  //   },
  // ],
  [
    { amountDesired: '3', currencyIn: 'BTC', currencyOut: 'WBTC' },
    {
      amountReceiving: '2.99375',
      feeBridgePercent: '0.002',
      feeMiner: '0.00025',
      feeCurrency: 'WBTC',
      feeTotal: '0.00625',
    },
  ],
  [
    { amountDesired: '156', currencyIn: 'WBTC', currencyOut: 'BTC' },
    {
      amountReceiving: '155.6877',
      feeBridgePercent: '0.002',
      feeMiner: '0.0003',
      feeCurrency: 'BTC',
      feeTotal: '0.3123',
    },
  ],
])('works for %O', async ({ amountDesired, currencyIn, currencyOut }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await estimateSwapAmountOut({
    context,
    currencyIn,
    currencyOut,
    amountDesired,
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
    await estimateSwapAmountOut({
      context,
      currencyIn,
      currencyOut,
      amountDesired: '1',
    });
  } catch (e) {
    expect(e.message).toMatch(/Could not find (test|production) bridge for/);
  }
});
