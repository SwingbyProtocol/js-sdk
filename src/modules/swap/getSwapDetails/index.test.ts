import { buildContext } from '../../context';
import { CommonFloatParams } from '../../common-params';

import { getSwapDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<CommonFloatParams<'test'>, 'hash'>>([
  { hash: '8MtOm5dQjqwonh9kAtO0Wveri5qVHzcCQ6QN1EuSm_E=' },
])('gets swaps details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getSwapDetails({ context, hash });

  return expect(result).toMatchObject({
    addressUserOut: null,
    addressUserIn: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7',
    addressSwapIn: 'mzJ9Gi7vvp1NGw4fviWjkZaJxWakk5zfHt',
    amountIn: '0.07999522',
    amountOut: '0.07991522',
    currencyIn: 'BTC',
    currencyOut: 'BTCE',
    feeTotal: '0.00008',
    feeCurrency: 'BTCE',
    hash: '8MtOm5dQjqwonh9kAtO0Wveri5qVHzcCQ6QN1EuSm_E=',
    status: 'COMPLETED',
    transactionInId: '53f8d9818f0842654fb3d472a6c8fdd3f4baf8caa3193eb53a6e9170dd2b8ca6',
    transactionOutId: '0x8d2de055cb46b9f70832a32144c401d0aa98201bc964eae309e28ba5e3b17ad8',
    timestamp: new Date('2020-12-10T23:48:40.000Z'),
  });
});
