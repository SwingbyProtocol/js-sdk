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
    addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc',
    addressDeposit: '0xe06ff2b69b822807b8ac14479ff4386fe051e242',
    amountDeposit: '0.00098766',
    amountReceiving: '0.00073568',
    currencyDeposit: 'sbBTC',
    currencyReceiving: 'WBTC',
    feeCurrency: 'WBTC',
    feeTotal: '0.00025198',
    hash,
    status: 'SENDING',
    txDepositId: '0x207cb67ff5aa3e435444dd6ffb900232ed2e5abb94c90b4a4b3d7d8e4e5787ce',
    txReceivingId: null,
    timestamp: new Date('2020-12-21T14:13:48.000Z'),
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
