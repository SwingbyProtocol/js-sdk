import { buildContext } from '../context';
import type { SkybridgeParams } from '../common-params';
import type { SkybridgeResource } from '../resources';

import { runProofOfWork } from './runProofOfWork';

jest.mock('../context/buildContext');
jest.mock('./getBlockHeight', () => ({ getBlockHeight: () => NaN }));
jest.mock('./getPowEpoch', () => ({ getPowEpoch: () => 100 }));

it.each<
  Pick<
    SkybridgeParams<SkybridgeResource, 'test'>,
    'currencyDeposit' | 'currencyReceiving' | 'amountDesired' | 'addressReceiving'
  > & { expected: Pick<SkybridgeParams<SkybridgeResource, 'test'>, 'nonce' | 'amountDeposit'> }
>([
  {
    amountDesired: '1',
    currencyDeposit: 'BTC',
    currencyReceiving: 'BTCB.BEP20',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '0.99999446', nonce: 801 },
  },
  {
    amountDesired: '0.02950426',
    currencyDeposit: 'BTCB.BEP20',
    currencyReceiving: 'BTC',
    addressReceiving: 'msEKP7ZSma3rQtWSQBBZCiJAvjAaowf2c6',
    expected: { amountDeposit: '0.02949633', nonce: 1055 },
  },
  {
    amountDesired: '1',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '0.99999446', nonce: 801 },
  },
  {
    amountDesired: '1.12',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '1.11999802', nonce: 1947 },
  },
  {
    amountDesired: '1.1234',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '1.12339563', nonce: 69 },
  },
  {
    amountDesired: '1.12345',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '1.12344929', nonce: 1408 },
  },
  {
    amountDesired: '1.123456',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '1.12344929', nonce: 1408 },
  },
  {
    amountDesired: '1.123456789',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '1.12344929', nonce: 1408 },
  },
  {
    amountDesired: '0.02950426',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '0.02949382', nonce: 83 },
  },
  {
    amountDesired: '1',
    currencyDeposit: 'WBTC',
    currencyReceiving: 'BTC',
    addressReceiving: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    expected: { amountDeposit: '0.99999116', nonce: 1079 },
  },
  {
    amountDesired: '1',
    currencyDeposit: 'WBTC',
    currencyReceiving: 'BTC',
    addressReceiving: 'msEKP7ZSma3rQtWSQBBZCiJAvjAaowf2c6',
    expected: { amountDeposit: '0.99999202', nonce: 1114 },
  },
  {
    amountDesired: '1',
    currencyDeposit: 'WBTC',
    currencyReceiving: 'sbBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '0.99999233', nonce: 1066 },
  },
])('works for %s', async ({ expected, ...params }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await runProofOfWork({ ...params, context });

  expect(result).toMatchObject(expected);
});
