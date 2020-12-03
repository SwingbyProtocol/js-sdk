import { Coin } from '../coins';
import { buildContext } from '../context';
import { Mode } from '../modes';

import { buildExplorerLink } from '.';

jest.mock('../context/buildContext');

it.each<[{ mode: Mode; coin: Coin; transactionId: string }, string]>([
  [
    {
      mode: 'test',
      coin: 'BTCB',
      transactionId: 'my-id',
    },
    'https://testnet-explorer.binance.org/tx/my-id',
  ],
  [
    {
      mode: 'production',
      coin: 'BTCB',
      transactionId: 'my-id',
    },
    'https://explorer.binance.org/tx/my-id',
  ],
  [
    {
      mode: 'test',
      coin: 'BTC',
      transactionId: 'my-id',
    },
    'https://www.blockchain.com/btc-testnet/tx/my-id',
  ],
  [
    {
      mode: 'production',
      coin: 'BTC',
      transactionId: 'my-id',
    },
    'https://www.blockchain.com/btc/tx/my-id',
  ],
  [
    {
      mode: 'test',
      coin: 'WBTC',
      transactionId: 'my-id',
    },
    'https://goerli.etherscan.io/tx/my-id',
  ],
  [
    {
      mode: 'production',
      coin: 'WBTC',
      transactionId: 'my-id',
    },
    'https://etherscan.io/tx/my-id',
  ],
])('works for %O', async ({ mode, coin, transactionId }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  return expect(
    buildExplorerLink({
      context,
      coin,
      transactionId,
    }),
  ).toBe(expected);
});
