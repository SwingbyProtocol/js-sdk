import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getFloatDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'dniUX39yLjKMPixHawxeyreUYpgaDafFlpP1YN4BK_o=' },
])('gets float details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getFloatDetails({ context, hash });

  return expect(result).toMatchObject({
    addressUserOut: null,
    addressUserIn: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    addressSwapIn: 'msEKP7ZSma3rQtWSQBBZCiJAvjAaowf2c6',
    amountIn: '0.00099717',
    amountOut: '0.00074517',
    currencyIn: 'BTC',
    currencyOut: 'WBTC',
    feeCurrency: 'WBTC',
    feeTotal: '0.000252',
    hash,
    status: 'COMPLETED',
    transactionInId: 'b025316d9f6f4c1b111f525988ebcdc2ad67a798c0b276ffb9be7e48e8ba814b',
    transactionOutId: '0x8a5bfbab780396e8de5731d61de846d51de294bda98b7c8cad742d4c56840cbb',
    timestamp: new Date('2020-12-21T08:31:56.000Z'),
  });
});
