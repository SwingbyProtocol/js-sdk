import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getFloatDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: '6DprEcwjNwrc1__8la5zl6C5_XMgwVP3TYNtlFsdedY=' },
])('gets float details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getFloatDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc',
    addressDeposit: 'mhRbY32nWLQRZFSapEdxYgkKsb7pCgQxfT',
    amountDeposit: '0.00399399',
    amountReceiving: '0.00394353',
    currencyDeposit: 'BTC',
    currencyReceiving: 'sbBTC',
    hash,
    status: 'COMPLETED',
    txDepositId: '3f5793066ace966623c5e7c6c8983172e5a0fd9ade862262429121a15ae95ed1',
    txReceivingId: null,
    timestamp: new Date('2021-01-04T10:52:16.000Z'),
  });
});
