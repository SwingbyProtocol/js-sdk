import { buildContext } from '../../../context';
import { CommonSwapParams } from '../../../swap-params';

import { calculateSwap } from './';

jest.mock('../../../context/buildContext');
jest.mock('./getBlockHeight', () => ({ getBlockHeight: () => 100 }));

it.each<
  [
    Pick<CommonSwapParams<'test'>, 'currencyIn' | 'currencyOut' | 'amountUser' | 'addressOut'>,
    Pick<CommonSwapParams<'test'>, 'nonce' | 'amountIn'>,
  ]
>([
  [
    {
      amountUser: '1',
      currencyIn: 'BTC',
      currencyOut: 'BTCB',
      addressOut: 'tbnb1k3cp6jl7z757hewt30nfvr97uywlxeap69glam',
    },
    { amountIn: '0.99998995', nonce: 2646 },
  ],
  [
    {
      amountUser: '1',
      currencyIn: 'BTC',
      currencyOut: 'BTCE',
      addressOut: '0x3ff3ada69b19a6fdfe4ed96c9dc49aab1763bdf3',
    },
    { amountIn: '0.99999573', nonce: 312 },
  ],
  [
    {
      amountUser: '1',
      currencyIn: 'BTCE',
      currencyOut: 'BTC',
      addressOut: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    },
    { amountIn: '0.99999715', nonce: 610 },
  ],
])('works for %s', async (params, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await calculateSwap({ ...params, context });

  expect(result).toMatchObject(expected);
});
