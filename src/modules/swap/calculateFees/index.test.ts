import type { Coin } from '../../coins';
import { buildContext } from '../../context';

import { calculateFees } from './';

jest.mock('../../context/buildContext');

it.each<[{ currencyIn: Coin<'test'>; currencyOut: Coin<'test'> }, any]>([
  [
    { currencyIn: 'BTC', currencyOut: 'BTCB' },
    { feeBridgePercent: '0.001', feeMiner: '0.000005', feeCurrency: 'BTCB' },
  ],
  [
    { currencyIn: 'BTC', currencyOut: 'BTCE' },
    { feeBridgePercent: '0.001', feeMiner: '0', feeCurrency: 'BTCE' },
  ],
  [
    { currencyIn: 'BTCE', currencyOut: 'BTCB' },
    { feeBridgePercent: '0.001', feeMiner: '0.000005', feeCurrency: 'BTCB' },
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
