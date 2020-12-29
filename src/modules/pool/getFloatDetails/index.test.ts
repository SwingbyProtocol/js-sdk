import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getFloatDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'bWRloGO3ah3p9jJ_MKNZLF6x3Nr4rgp0fh0D5RIYo5E=' },
])('gets float details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getFloatDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc',
    addressDeposit: 'mhRbY32nWLQRZFSapEdxYgkKsb7pCgQxfT',
    amountDeposit: '0.00099019',
    amountReceiving: '0.00099019',
    currencyDeposit: 'BTC',
    currencyReceiving: 'sbBTC',
    hash,
    status: 'COMPLETED',
    txDepositId: '1bca4204aed84e083e7f0207b0018e844b8087c5d45158568643c79df268f4ef',
    txReceivingId: null,
    timestamp: new Date('2020-12-22T15:51:17.000Z'),
  });
});
