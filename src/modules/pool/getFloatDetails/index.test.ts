import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getFloatDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'QahqKLpoqM2rqRv7mj-CYvrGik-5H25wo9RFDSKZAZk=' },
])('gets float details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getFloatDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: '0x219b35ff0528fe11e55f68f9a63e0b1392b0a299',
    addressDeposit: '0xbe83f11d3900f3a13d8d12fb62f5e85646cda45e',
    amountDeposit: '3.73369054',
    amountReceiving: '3.69238734',
    currencyDeposit: 'WBTC',
    currencyReceiving: 'sbBTC',
    hash,
    status: 'COMPLETED',
    txDepositId: '0xdf4c0bc0c3d456e2f6ef78daa2058768ae0236b084885bea48ecc6b5c5e0ceed',
    txReceivingId: null,
    timestamp: new Date('2021-03-11T12:49:36.000Z'),
  });
});
