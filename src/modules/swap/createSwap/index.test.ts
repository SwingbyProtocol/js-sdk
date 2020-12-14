import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { createSwap } from './';

jest.mock('../../context/buildContext');

it.each<
  Pick<
    SkybridgeParams<'swap', 'test'>,
    'addressUserIn' | 'currencyIn' | 'currencyOut' | 'amountUser'
  >
>([
  {
    amountUser: '1',
    addressUserIn: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyIn: 'BTC',
    currencyOut: 'WBTC',
  },
  {
    amountUser: '1',
    addressUserIn: 'tbnb16ke3clwqmduvzv6awlprjw3ecw7g52qw7c6hdm',
    currencyIn: 'BTC',
    currencyOut: 'BTCB',
  },
])(
  '"/swaps/create" succeeds with %O',
  async ({ addressUserIn, currencyIn, currencyOut, amountUser }) => {
    jest.setTimeout(180000);
    expect.assertions(1);

    try {
      const context = await buildContext({ mode: 'test' });
      const result = await createSwap({
        context,
        addressUserIn,
        currencyIn,
        currencyOut,
        amountUser,
      });
      return expect(result).toMatchObject({
        addressSwapIn: expect.any(String),
        addressUserIn,
        amountIn: expect.stringContaining('0.99'),
        amountOut: expect.stringContaining('0.99'),
        currencyIn,
        currencyOut,
        timestamp: expect.any(Date),
      });
    } catch (e) {
      expect(e.message).toMatch(/The KVStore key \d+ already exists in epoch bucket \d+/);
    }
  },
);
