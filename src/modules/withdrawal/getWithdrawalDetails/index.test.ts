import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getWithdrawalDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 't2CaqiS60g0wEyGXgrYi4nwKWw8F7dJRNQPAceWVx8I=' },
])('gets withdrawal details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getWithdrawalDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc',
    addressDeposit: '0x6c3F42F943022B4746Fb6522760F62ae758b8826',
    amountDeposit: '0.00098851',
    amountReceiving: '0.00073653',
    currencyDeposit: 'sbBTC',
    currencyReceiving: 'WBTC',
    feeCurrency: 'WBTC',
    feeTotal: '0.00025198',
    hash,
    status: 'COMPLETED',
    txDepositId: '0xa772b0ec48c436f82739e69ed624f8f5427afac6bbaa70361a67490340b762fc',
    txReceivingId: null,
    timestamp: new Date('2020-12-22T16:26:08.000Z'),
  });
});

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'sQmT1Q1RROVwVLxs2wJWa5ZVa49zFIBr-9jC_wJsyqM=' },
])('throws for normal swap %O', async ({ hash }) => {
  expect.assertions(1);

  try {
    const context = await buildContext({ mode: 'test' });
    await getWithdrawalDetails({ context, hash });
  } catch (e) {
    expect(e.message).toMatch(/is not a withdrawal, it is a swap/);
  }
});
