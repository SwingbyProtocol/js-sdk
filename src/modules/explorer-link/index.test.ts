import type { SkybridgeCoin } from '../coins';
import { buildContext } from '../context';
import type { SkybridgeMode } from '../modes';

import { buildExplorerLink } from '.';

jest.mock('../context/buildContext');

it.each<[{ mode: SkybridgeMode; coin: SkybridgeCoin; transactionId: string }, string]>([
  [
    {
      mode: 'test',
      coin: 'BTCB.BEP20',
      transactionId: 'my-id',
    },
    'https://testnet.bscscan.com/tx/my-id',
  ],
  [
    {
      mode: 'production',
      coin: 'BTCB.BEP20',
      transactionId: 'my-id',
    },
    'https://bscscan.com/tx/my-id',
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
    'https://ropsten.etherscan.io/tx/my-id',
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
