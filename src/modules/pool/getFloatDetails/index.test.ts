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
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    addressDeposit: 'msEKP7ZSma3rQtWSQBBZCiJAvjAaowf2c6',
    amountIn: '0.00099747',
    amountOut: null,
    currencyIn: 'BTC',
    currencyOut: 'sbBTC',
    feeCurrency: null,
    feeTotal: null,
    hash,
    status: 'COMPLETED',
    transactionInId: 'd5680247e9a7a1b2551831ec3b4b942970041448d02999a2af8cdd49473681f3',
    transactionOutId: null,
    timestamp: new Date('2020-12-21T09:00:07.000Z'),
  });
});
