import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getSwapDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'e-0WXydIr6vpjQwJ3NneXvPPTNoJ_N-Qw_bZwYUu8eU=' },
])('gets swaps details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getSwapDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: '0x8d977a2c4736b42c89af5cff05e14dd8c1ca1d30',
    addressDeposit: '1jkxfyP5Ds5MQzQrWv81mPBEGuYGyWWzb',
    amountDeposit: '0.23499648',
    amountReceiving: '0.23437648',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    feeCurrency: 'WBTC',
    feeTotal: '0.00062',
    hash,
    status: 'COMPLETED',
    txDepositId: 'da58a782dd6cbb91954482a59371c31e780f33db6da3c51bc8f8b8a514df4038',
    txReceivingId: '0xdf7164bda6e549c8aef81f642d8f7e01d35cdb6c5e21ddb0eaf35896bba15ad2',
    timestamp: new Date('2021-03-17T11:03:09.000Z'),
  });
});

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'xB2z_jUEKAvD7Qt-nnw8S2AUh2SPLtxXAYypm5oX1LI=' },
])('works for withdrawal %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getSwapDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: 'bc1qfj26f06v44qdye40y4dxdkyx8gl3h802hdlxyp',
    addressDeposit: '0xbe83f11d3900f3a13d8d12fb62f5e85646cda45e',
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
