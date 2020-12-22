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
      'currencyDeposit' | 'currencyOut' | 'amountDesired' | 'addressReceiving'
    >,
    Pick<SkybridgeParams<SkybridgeResource, 'test'>, 'nonce' | 'amountDeposit'>,
  ]
>([
  [
    {
      amountDesired: '1',
      currencyDeposit: 'BTC',
      currencyOut: 'BTCB',
      addressReceiving: 'tbnb1k3cp6jl7z757hewt30nfvr97uywlxeap69glam',
    },
    { amountDeposit: '0.99998995', nonce: 2646 },
  ],
  [
    {
      amountDesired: '1',
      currencyDeposit: 'BTC',
      currencyOut: 'WBTC',
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountDeposit: '0.99999948', nonce: 743 },
  ],
  [
    {
      amountDesired: '1',
      currencyDeposit: 'WBTC',
      currencyOut: 'BTC',
      addressReceiving: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    },
    { amountDeposit: '0.9999927', nonce: 257 },
  ],
  [
    {
      amountDesired: '1',
      currencyDeposit: 'WBTC',
      currencyOut: 'BTC',
      addressReceiving: 'msEKP7ZSma3rQtWSQBBZCiJAvjAaowf2c6',
    },
    { amountDeposit: '0.99999817', nonce: 4221 },
  ],
  [
    {
      amountDesired: '1',
      currencyDeposit: 'WBTC',
      currencyOut: 'sbBTC',
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountDeposit: '0.9999961', nonce: 1722 },
  ],
])('works for %s', async (params, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await runProofOfWork({ ...params, context });

  expect(result).toMatchObject(expected);
});
