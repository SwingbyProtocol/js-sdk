import { buildContext } from '../../context';

import { createSwap } from './';

jest.mock('../../context/buildContext');

it('gets back swap info after calling "/swaps/create"', async () => {
  jest.setTimeout(120000);

  expect.assertions(1);

  const addressOut = '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7';
  const currencyIn = 'BTC';
  const currencyOut = 'BTCE';

  const context = await buildContext({ mode: 'test' });

  return expect(
    createSwap({
      context,
      addressOut,
      currencyIn,
      currencyOut,
      amountUser: '1',
    }),
  ).resolves.toMatchObject({
    addressIn: expect.any(String),
    addressOut: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7',
    amountIn: expect.stringContaining('0.99'),
    currencyIn: 'BTC',
    currencyOut: 'BTCE',
    timestamp: expect.any(Date),
  });
});
