import { buildContext } from '../../context';
import { calculateSwap } from '../calculateSwap';

import { createSwap } from './';

jest.mock('../../context');

it('gets back swap info after calling "/swaps/create"', async () => {
  jest.setTimeout(120000);

  expect.assertions(1);

  const addressOut = 'tbnb16ke3clwqmduvzv6awlprjw3ecw7g52qw7c6hdm';
  const currencyIn = 'BTC';
  const currencyOut = 'BTC.B';

  const context = await buildContext({ mode: 'test' });
  const { nonce, amountIn } = await calculateSwap({
    context,
    amountIn: '1',
    addressOut,
    currencyIn,
    currencyOut,
  });

  return expect(
    createSwap({
      context,
      amountIn,
      nonce,
      addressOut,
      currencyIn,
      currencyOut,
    }),
  ).resolves.toMatchObject({
    addressIn: expect.any(String),
    addressOut: 'tbnb16ke3clwqmduvzv6awlprjw3ecw7g52qw7c6hdm',
    amountIn: expect.stringContaining('0.99'),
    currencyIn: 'BTC',
    currencyOut: 'BTC.B',
    timestamp: expect.any(Date),
  });
});
