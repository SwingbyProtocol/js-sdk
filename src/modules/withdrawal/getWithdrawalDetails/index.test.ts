import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getWithdrawalDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'HKIPyyDX2oAgplGThTFdCt50a5YsfPe506BQMQnJHOU=' },
])('gets withdrawal details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getWithdrawalDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc',
    addressDeposit: '0x6c3F42F943022B4746Fb6522760F62ae758b8826',
    amountDeposit: '0.00199223',
    amountReceiving: '0.00201809',
    currencyDeposit: 'sbBTC',
    currencyReceiving: 'WBTC',
    feeCurrency: 'sbBTC',
    feeTotal: '0.00015404',
    hash,
    status: 'COMPLETED',
    txDepositId: '0x0770915d082b11f76678c01d3161089730c66449960abe874f053cf20061d919',
    txReceivingId: null,
    timestamp: new Date('2021-01-04T10:59:11.000Z'),
  });
});

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'asG3GufNCz2AisFAFlMPHK6AuSFieRrArheTmqyDvuc=' },
])('throws for normal swap %O', async ({ hash }) => {
  expect.assertions(1);

  try {
    const context = await buildContext({ mode: 'test' });
    await getWithdrawalDetails({ context, hash });
  } catch (e) {
    expect(e.message).toMatch(/is not a withdrawal, it is a swap/);
  }
});
