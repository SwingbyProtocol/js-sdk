import { Coin } from '../coins';
import { buildContext } from '../context';
import { Mode } from '../modes';

import { buildExplorerLink } from '.';

jest.mock('../context/buildContext');

it.each<[{ mode: Mode; currency: Coin; transactionId: string }, string]>([
  [
    {
      mode: 'test',
      currency: 'BTCB',
      transactionId: 'my-id',
    },
    'https://testnet-explorer.binance.org/tx/my-id',
  ],
  [
    {
      mode: 'production',
      currency: 'BTCB',
      transactionId: 'my-id',
    },
    'https://explorer.binance.org/tx/my-id',
  ],
  [
    {
      mode: 'test',
      currency: 'BTC',
      transactionId: 'my-id',
    },
    'https://www.blockchain.com/btc-testnet/tx/my-id',
  ],
  [
    {
      mode: 'production',
      currency: 'BTC',
      transactionId: 'my-id',
    },
    'https://www.blockchain.com/btc/tx/my-id',
  ],
  [
    {
      mode: 'test',
      currency: 'WBTC',
      transactionId: 'my-id',
    },
    'https://goerli.etherscan.io/tx/my-id',
  ],
  [
    {
      mode: 'production',
      currency: 'WBTC',
      transactionId: 'my-id',
    },
    'https://etherscan.io/tx/my-id',
  ],
])('works for %O', async ({ mode, currency, transactionId }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  buildExplorerLink({
    context,
    currency,
    transactionId,
  });
  return expect(
    buildExplorerLink({
      context,
      currency,
      transactionId,
    }),
  ).toBe(expected);
});
