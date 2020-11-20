import type { Coin } from '../../coins';
import { buildContext } from '../../context';

import { estimateAmountOut } from './';

jest.mock('../../context/buildContext');

it.each<[{ amountIn: string; currencyIn: Coin<'test'>; currencyOut: Coin<'test'> }, any]>([
  [
    { amountIn: '1', currencyIn: 'BTC', currencyOut: 'BTCB' },
    {
      amountOut: '0.998995',
      bridgeFeePercent: '0.001',
      minerFee: '0.000005',
      minerFeeCurrency: 'BTCB',
      minerFeeInt: '500',
    },
  ],
  [
    { amountIn: '3', currencyIn: 'BTC', currencyOut: 'BTCE' },
    {
      amountOut: '2.997',
      bridgeFeePercent: '0.001',
      minerFee: '0',
      minerFeeCurrency: 'BTCE',
      minerFeeInt: '0',
    },
  ],
  [
    { amountIn: '156', currencyIn: 'BTCE', currencyOut: 'BTCB' },
    {
      amountOut: '155.843995',
      bridgeFeePercent: '0.001',
      minerFee: '0.000005',
      minerFeeCurrency: 'BTCB',
      minerFeeInt: '500',
    },
  ],
])('works for %O', async ({ amountIn, currencyIn, currencyOut }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await estimateAmountOut({
    context,
    currencyIn,
    currencyOut,
    amountIn,
  });

  expect(result).toMatchObject(expected);
});
