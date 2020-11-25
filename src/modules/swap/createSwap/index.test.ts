import { buildContext } from '../../context';
import { CommonSwapParams } from '../../swap-params';

import { createSwap } from './';

jest.mock('../../context/buildContext');

it.each<Pick<CommonSwapParams<'test'>, 'addressOut' | 'currencyIn' | 'currencyOut' | 'amountUser'>>(
  [
    {
      amountUser: '1',
      addressOut: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7',
      currencyIn: 'BTC',
      currencyOut: 'BTCE',
    },
    {
      amountUser: '1',
      addressOut: 'tbnb16ke3clwqmduvzv6awlprjw3ecw7g52qw7c6hdm',
      currencyIn: 'BTC',
      currencyOut: 'BTCB',
    },
  ],
)(
  '"/swaps/create" succeeds with %O',
  async ({ addressOut, currencyIn, currencyOut, amountUser }) => {
    jest.setTimeout(180000);
    expect.assertions(1);

    try {
      const context = await buildContext({ mode: 'test' });
      const result = await createSwap({ context, addressOut, currencyIn, currencyOut, amountUser });
      return expect(result).toMatchObject({
        addressIn: expect.any(String),
        addressOut,
        amountIn: expect.stringContaining('0.99'),
        currencyIn,
        currencyOut,
        timestamp: expect.any(Date),
      });
    } catch (e) {
      expect(e.message).toMatch(/The KVStore key \d+ already exists in epoch bucket \d+/);
    }
  },
);
