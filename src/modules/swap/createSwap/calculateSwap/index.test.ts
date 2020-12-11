import { buildContext } from '../../../context';
import { CommonSwapParams } from '../../../common-params';

import { calculateSwap } from './';

jest.mock('../../../context/buildContext');
jest.mock('./getBlockHeight', () => ({ getBlockHeight: () => 100 }));

it.each<
  [
    Pick<CommonSwapParams<'test'>, 'currencyIn' | 'currencyOut' | 'amountUser' | 'addressUserIn'>,
    Pick<CommonSwapParams<'test'>, 'nonce' | 'amountIn'>,
  ]
>([
  [
    {
      amountUser: '1',
      currencyIn: 'BTC',
      currencyOut: 'BTCB',
      addressUserIn: 'tbnb1k3cp6jl7z757hewt30nfvr97uywlxeap69glam',
    },
    { amountIn: '0.99998995', nonce: 2646 },
  ],
  [
    {
      amountUser: '1',
      currencyIn: 'BTC',
      currencyOut: 'WBTC',
      addressUserIn: '0x3ff3ada69b19a6fdfe4ed96c9dc49aab1763bdf3',
    },
    { amountIn: '0.99999573', nonce: 312 },
  ],
  [
    {
      amountUser: '1',
      currencyIn: 'WBTC',
      currencyOut: 'BTC',
      addressUserIn: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    },
    { amountIn: '0.9999927', nonce: 257 },
  ],
])('works for %s', async (params, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await calculateSwap({ ...params, context });

  expect(result).toMatchObject(expected);
});
