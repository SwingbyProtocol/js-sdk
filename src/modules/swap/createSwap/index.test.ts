import { createSwap } from './';

it('', () => {
  expect.assertions(1);
  return expect(
    createSwap({
      network: 'test',
      addressTo: '0x9b7357e9f52822d2ee99dcc4b2bcaf24b97bf430',
      amount: '1',
      currencyFrom: 'BTC',
      currencyTo: 'WBTC',
      nonce: 114,
    }),
  ).resolves.toMatchObject({ ok: true });
});
