import { calculateSwap } from '../calculateSwap';

import { createSwap } from './';

it('gets back swap info after calling "/swaps/create"', async () => {
  jest.setTimeout(120000);

  expect.assertions(1);

  const addressTo = 'tbnb16ke3clwqmduvzv6awlprjw3ecw7g52qw7c6hdm';
  const currencyFrom = 'BTC';
  const currencyTo = 'BTC.B';

  const { nonce, amount } = await calculateSwap({
    amount: '1',
    addressTo,
    currencyFrom,
    currencyTo,
  });

  return expect(
    createSwap({
      amount,
      nonce,
      network: 'test',
      addressTo,
      currencyFrom,
      currencyTo,
    }),
  ).resolves.toMatchObject({
    ok: true,
    response: {
      addressIn: expect.any(String),
      addressOut: 'tbnb16ke3clwqmduvzv6awlprjw3ecw7g52qw7c6hdm',
      amountIn: expect.stringContaining('0.'),
      currencyIn: 'BTC',
      currencyOut: 'BTC.B',
      timestamp: expect.any(Number),
    },
  });
});
