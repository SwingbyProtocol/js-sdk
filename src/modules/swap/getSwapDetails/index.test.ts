import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getSwapDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'D6ffXDodsQevLWS0EX_Od4i120TNvbAdCRAjAouKDXg=' },
])('gets swaps details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getSwapDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: 'tb1q8hk7wlqgtvdrvtmjll4xtxkpjdf5svtcgmacep',
    addressDeposit: 'msEKP7ZSma3rQtWSQBBZCiJAvjAaowf2c6',
    amountDeposit: '0.00099717',
    amountReceiving: '0.00074517',
    currencyDeposit: 'BTC',
    currencyReceiving: 'BTC',
    feeCurrency: 'BTC',
    feeTotal: '0.000252',
    hash,
    status: 'REFUNDED',
    txDepositId: 'b025316d9f6f4c1b111f525988ebcdc2ad67a798c0b276ffb9be7e48e8ba814b',
    txReceivingId: 'd0b7fae62c5c5ef281fd021eac9da9dbd6340324d642cddb5e76fbc61a995a9a',
    timestamp: new Date('2020-12-21T08:31:56.000Z'),
  });
});

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'wV5XmpgMgU9T9S-3wiaaYJN32RV9bNpLGB7XM78khj8=' },
])('throws for withdrawal %O', async ({ hash }) => {
  expect.assertions(1);

  try {
    const context = await buildContext({ mode: 'test' });
    await getSwapDetails({ context, hash });
  } catch (e) {
    expect(e.message).toMatch(/is not a swap, it is a withdrawal/);
  }
});
