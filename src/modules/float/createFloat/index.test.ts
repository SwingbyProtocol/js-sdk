import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { createFloat } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'pool', 'test'>, 'addressUserIn' | 'currencyIn' | 'amountUser'>>([
  {
    amountUser: '1',
    addressUserIn: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyIn: 'BTC',
  },
  {
    amountUser: '1',
    addressUserIn: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyIn: 'BTC',
  },
])('"/swaps/create" succeeds with %O', async ({ addressUserIn, currencyIn, amountUser }) => {
  jest.setTimeout(180000);
  expect.assertions(1);

  try {
    const context = await buildContext({ mode: 'test' });
    const result = await createFloat({
      context,
      addressUserIn,
      currencyIn,
      amountUser,
    });
    return expect(result).toMatchObject({
      addressSwapIn: expect.any(String),
      addressUserIn,
      amountIn: expect.stringContaining('0.99'),
      currencyIn,
      currencyOut: 'sbBTC',
      timestamp: expect.any(Date),
    });
  } catch (e) {
    expect(e.message).toMatch(/The KVStore key \d+ already exists in epoch bucket \d+/);
  }
});
