import type { Coin } from '../../coins';
import { buildContext } from '../../context';

import { calculateFees } from './';

jest.mock('../../context/buildContext');

it.each<[{ currencyIn: Coin<'test'>; currencyOut: Coin<'test'> }, any]>([
  [
    { currencyIn: 'BTC', currencyOut: 'BTCB' },
    {
      bridgeFeePercent: '0.001',
      minerFee: '0.000005',
      minerFeeCurrency: 'BTCB',
      minerFeeInt: '500',
    },
  ],
  [
    { currencyIn: 'BTC', currencyOut: 'BTCE' },
    { bridgeFeePercent: '0.001', minerFee: '0', minerFeeCurrency: 'BTCE', minerFeeInt: '0' },
  ],
  [
    { currencyIn: 'BTCE', currencyOut: 'BTCB' },
    {
      bridgeFeePercent: '0.001',
      minerFee: '0.000005',
      minerFeeCurrency: 'BTCB',
      minerFeeInt: '500',
    },
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
