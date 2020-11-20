import type { Coin } from '../../coins';
import { buildContext } from '../../context';

import { estimateAmountOut } from './';

jest.mock('../../context/buildContext');

it.each<[{ amountUser: string; currencyIn: Coin<'test'>; currencyOut: Coin<'test'> }, any]>([
  [
    { amountUser: '1', currencyIn: 'BTC', currencyOut: 'BTCB' },
    {
      amountOut: '0.998995',
      feeBridgePercent: '0.001',
      feeMiner: '0.000005',
      feeCurrency: 'BTCB',
      feeTotal: '0.001005',
    },
  ],
  [
    { amountUser: '3', currencyIn: 'BTC', currencyOut: 'BTCE' },
    {
      amountOut: '2.997',
      feeBridgePercent: '0.001',
      feeMiner: '0',
      feeCurrency: 'BTCE',
      feeTotal: '0.003',
    },
  ],
  [
    { amountUser: '156', currencyIn: 'BTCE', currencyOut: 'BTCB' },
    {
      amountOut: '155.843995',
      feeBridgePercent: '0.001',
      feeMiner: '0.000005',
      feeCurrency: 'BTCB',
      feeTotal: '0.156005',
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
