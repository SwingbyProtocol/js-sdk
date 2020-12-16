import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { createWithdrawal } from '.';

jest.mock('../../context/buildContext');

it.each<
  Pick<SkybridgeParams<'withdrawal', 'test'>, 'addressUserIn' | 'currencyOut' | 'amountUser'>
>([
  {
    amountUser: '1',
    addressUserIn: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyOut: 'BTC',
  },
  {
    amountUser: '1',
    addressUserIn: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyOut: 'BTC',
  },
])('"/swaps/create" succeeds with %O', async ({ addressUserIn, currencyOut, amountUser }) => {
  jest.setTimeout(180000);
  expect.assertions(1);

  try {
    const context = await buildContext({ mode: 'test' });
    const result = await createWithdrawal({
      context,
      addressUserIn,
      currencyOut,
      amountUser,
    });
    return expect(result).toMatchObject({
      addressSwapIn: expect.any(String),
      addressUserIn,
      amountIn: expect.stringContaining('0.99'),
      currencyIn: 'sbBTC',
      currencyOut,
      timestamp: expect.any(Date),
    });
  } catch (e) {
    expect(e.message).toMatch(/The KVStore key \d+ already exists in epoch bucket \d+/);
  }
});
