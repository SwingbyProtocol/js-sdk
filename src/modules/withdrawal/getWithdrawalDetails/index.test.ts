import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getWithdrawalDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'wV5XmpgMgU9T9S-3wiaaYJN32RV9bNpLGB7XM78khj8=' },
])('gets withdrawal details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getWithdrawalDetails({ context, hash });

  return expect(result).toMatchObject({
    addressUserOut: null,
    addressUserIn: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    addressSwapIn: 'mzJ9Gi7vvp1NGw4fviWjkZaJxWakk5zfHt',
    amountIn: '0.0000954',
    amountOut: '0.0000953',
    currencyIn: 'BTC',
    currencyOut: 'WBTC',
    feeCurrency: 'WBTC',
    feeTotal: '0.0000001',
    hash,
    status: 'COMPLETED',
    transactionInId: 'ea3549ee8887b9c707d4ee5301ad8e4da6989b39099b758b09bcede24613dc11',
    transactionOutId: '0x8a5bfbab780396e8de5731d61de846d51de294bda98b7c8cad742d4c56840cbb',
    timestamp: new Date('2020-12-11T10:11:31.000Z'),
  });
});

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'D6ffXDodsQevLWS0EX_Od4i120TNvbAdCRAjAouKDXg=' },
])('throws for normal swap %O', async ({ hash }) => {
  expect.assertions(1);

  try {
    const context = await buildContext({ mode: 'test' });
    await getWithdrawalDetails({ context, hash });
  } catch (e) {
    expect(e.message).toMatch(/is not a withdrawal, it is a swap/);
  }
});
