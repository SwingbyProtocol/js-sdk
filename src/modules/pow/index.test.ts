import { buildContext } from '../context';
import type { SkybridgeParams } from '../common-params';
import type { SkybridgeResource } from '../resources';

import { runProofOfWork } from './';

jest.mock('../context/buildContext');
jest.mock('./getBlockHeight', () => ({ getBlockHeight: () => 100 }));

it.each<
  [
    Pick<
      SkybridgeParams<SkybridgeResource, 'test'>,
      'currencyIn' | 'currencyOut' | 'amountUser' | 'addressUserIn'
    >,
    Pick<SkybridgeParams<SkybridgeResource, 'test'>, 'nonce' | 'amountIn'>,
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
      addressUserIn: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountIn: '0.99999948', nonce: 743 },
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
  [
    {
      amountUser: '1',
      currencyIn: 'WBTC',
      currencyOut: 'BTC',
      addressUserIn: 'msEKP7ZSma3rQtWSQBBZCiJAvjAaowf2c6',
    },
    { amountIn: '0.99999817', nonce: 4221 },
  ],
  [
    {
      amountUser: '1',
      currencyIn: 'WBTC',
      currencyOut: 'sbBTC',
      addressUserIn: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountIn: '0.9999961', nonce: 1722 },
  ],
])('works for %s', async (params, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await runProofOfWork({ ...params, context });

  expect(result).toMatchObject(expected);
});
