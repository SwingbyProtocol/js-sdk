import type { Coin } from '../../coins';
import { buildContext } from '../../context';

import { estimateAmountOut } from './';

jest.mock('../../context/buildContext');

it.each<[{ amountUser: string; currencyIn: Coin<'test'>; currencyOut: Coin<'test'> }, any]>([
  [
    { amountUser: '1', currencyIn: 'BTC', currencyOut: 'BTCB' },
    {
      amountOut: '0.998995',
      bridgeFeePercent: '0.001',
      minerFee: '0.000005',
      minerFeeCurrency: 'BTCB',
      minerFeeInt: '500',
      totalFee: '0.001005',
    },
  ],
  [
    { amountUser: '3', currencyIn: 'BTC', currencyOut: 'BTCE' },
    {
      amountOut: '2.997',
      bridgeFeePercent: '0.001',
      minerFee: '0',
      minerFeeCurrency: 'BTCE',
      minerFeeInt: '0',
      totalFee: '0.003',
    },
  ],
  [
    { amountUser: '156', currencyIn: 'BTCE', currencyOut: 'BTCB' },
    {
      amountOut: '155.843995',
      bridgeFeePercent: '0.001',
      minerFee: '0.000005',
      minerFeeCurrency: 'BTCB',
      minerFeeInt: '500',
      totalFee: '0.156005',
    },
  ],
])('works for %O', async ({ amountUser, currencyIn, currencyOut }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await estimateAmountOut({
    context,
    currencyIn,
    currencyOut,
    amountUser,
  });

  expect(result).toMatchObject(expected);
});
