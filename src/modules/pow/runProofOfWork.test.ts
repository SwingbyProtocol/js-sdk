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
    expected: { amountDeposit: '0.99999437', nonce: 8958 },
  },
  // {
  //   amountDesired: '0.02950426',
  //   currencyDeposit: 'BTCB.BEP20',
  //   currencyReceiving: 'BTC',
  //   addressReceiving: 'msEKP7ZSma3rQtWSQBBZCiJAvjAaowf2c6',
  //   expected: { amountDeposit: '0.02949422', nonce: 6640 },
  // },
  {
    amountDesired: '1',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '0.99999437', nonce: 8958 },
  },
  {
    amountDesired: '1.12',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '1.11999585', nonce: 8680 },
  },
  {
    amountDesired: '1.1234',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '1.12339227', nonce: 17694 },
  },
  {
    amountDesired: '1.12345',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '1.12344012', nonce: 25707 },
  },
  {
    amountDesired: '1.123456',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '1.12344012', nonce: 25707 },
  },
  {
    amountDesired: '1.123456789',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '1.12344012', nonce: 25707 },
  },
  {
    amountDesired: '0.02950426',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    expected: { amountDeposit: '0.02949768', nonce: 4208 },
  },
  {
    amountDesired: '1',
    currencyDeposit: 'WBTC',
    currencyReceiving: 'BTC',
    addressReceiving: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    expected: { amountDeposit: '0.99999044', nonce: 5045 },
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
    expected: { amountDeposit: '0.99999034', nonce: 4894 },
  },
])('works for %s', async ({ expected, ...params }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await runProofOfWork({ ...params, context });

  expect(result).toMatchObject(expected);
});
