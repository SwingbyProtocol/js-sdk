import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getWithdrawalDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'xB2z_jUEKAvD7Qt-nnw8S2AUh2SPLtxXAYypm5oX1LI=' },
])('gets withdrawal details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getWithdrawalDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: 'bc1qfj26f06v44qdye40y4dxdkyx8gl3h802hdlxyp',
    addressDeposit: '0xbe83f11d3900F3a13d8D12fB62F5e85646cDA45e',
    amountDeposit: '0.18089368',
    amountReceiving: '0.18239044',
    currencyDeposit: 'sbBTC',
    currencyReceiving: 'BTC',
    feeCurrency: 'sbBTC',
    feeTotal: '0.00066612',
    hash,
    status: 'COMPLETED',
    txDepositId: '0x19336671ed090339010696aee44584654fd8815f0eaee881d84faf44f2479350',
    txReceivingId: null,
    timestamp: new Date('2021-03-15T05:53:54.000Z'),
  });
});

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'e-0WXydIr6vpjQwJ3NneXvPPTNoJ_N-Qw_bZwYUu8eU=' },
])('throws for normal swap %O', async ({ hash }) => {
  expect.assertions(1);

  try {
    const context = await buildContext({ mode: 'test' });
    await getWithdrawalDetails({ context, hash });
  } catch (e: any) {
    expect(e.message).toMatch(/is not a withdrawal, it is a swap/);
  }
});
