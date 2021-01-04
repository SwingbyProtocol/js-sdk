import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getSwapDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'asG3GufNCz2AisFAFlMPHK6AuSFieRrArheTmqyDvuc=' },
])('gets swaps details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getSwapDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc',
    addressDeposit: 'mhRbY32nWLQRZFSapEdxYgkKsb7pCgQxfT',
    amountDeposit: '0.00399921',
    amountReceiving: '0.00384121',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    feeCurrency: 'WBTC',
    feeTotal: '0.000158',
    hash,
    status: 'COMPLETED',
    txDepositId: '43b6980d019ec432dc5d8c4c3c3b0fa26c07cf8bfb8be58b42a8ccf20f561b4d',
    txReceivingId: '0x981dd197ca647e83bafc5f46829b47543fd3d74b785ba86f21dae07920dcfb73',
    timestamp: new Date('2021-01-04T10:48:28.000Z'),
  });
});

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'HKIPyyDX2oAgplGThTFdCt50a5YsfPe506BQMQnJHOU=' },
])('works for withdrawal %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getSwapDetails({ context, hash });

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
