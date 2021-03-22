import { buildContext } from '../context';
import type { SkybridgeParams } from '../common-params';
import type { SkybridgeResource } from '../resources';

import { runProofOfWork } from './runProofOfWork';

jest.mock('../context/buildContext');
jest.mock('./getBlockHeight', () => ({ getBlockHeight: () => 100 }));

it.each<
  [
    Pick<
      SkybridgeParams<SkybridgeResource, 'test'>,
      'currencyDeposit' | 'currencyReceiving' | 'amountDesired' | 'addressReceiving'
    >,
    Pick<SkybridgeParams<SkybridgeResource, 'test'>, 'nonce' | 'amountDeposit'>,
  ]
>([
  [
    {
      amountDesired: '1',
      currencyDeposit: 'BTC',
      currencyReceiving: 'BTCB.BEP20',
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountDeposit: '0.99998995', nonce: 2646 },
  ],
  [
    {
      amountDesired: '1',
      currencyDeposit: 'BTC',
      currencyReceiving: 'WBTC',
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountDeposit: '0.99999948', nonce: 743 },
  ],
  [
    {
      amountDesired: '1.12',
      currencyDeposit: 'BTC',
      currencyReceiving: 'WBTC',
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountDeposit: '1.11999981', nonce: 1826 },
  ],
  [
    {
      amountDesired: '1.1234',
      currencyDeposit: 'BTC',
      currencyReceiving: 'WBTC',
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountDeposit: '1.12339495', nonce: 595 },
  ],
  [
    {
      amountDesired: '1.12345',
      currencyDeposit: 'BTC',
      currencyReceiving: 'WBTC',
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountDeposit: '1.12344858', nonce: 207 },
  ],
  [
    {
      amountDesired: '1.123456',
      currencyDeposit: 'BTC',
      currencyReceiving: 'WBTC',
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountDeposit: '1.12344858', nonce: 207 },
  ],
  [
    {
      amountDesired: '1.123456789',
      currencyDeposit: 'BTC',
      currencyReceiving: 'WBTC',
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountDeposit: '1.12344858', nonce: 207 },
  ],
  [
    {
      amountDesired: '0.02950426',
      currencyDeposit: 'BTC',
      currencyReceiving: 'WBTC',
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    },
    { amountDeposit: '0.0294928', nonce: 1818 },
  ],
  [
    {
      amountDesired: '1',
      currencyDeposit: 'WBTC',
      currencyReceiving: 'BTC',
      addressReceiving: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    },
    { amountDeposit: '0.9999927', nonce: 257 },
  ],
  [
    {
      amountDesired: '1',
      currencyDeposit: 'WBTC',
      currencyReceiving: 'BTC',
      addressReceiving: 'msEKP7ZSma3rQtWSQBBZCiJAvjAaowf2c6',
    },
    { amountDeposit: '0.99999817', nonce: 4221 },
  ],
  [
    {
      amountDesired: '1',
      currencyDeposit: 'WBTC',
      currencyReceiving: 'sbBTC',
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
