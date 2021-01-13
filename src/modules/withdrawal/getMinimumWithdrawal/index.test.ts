import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';
import { SkybridgeCoin } from '../../coins';

import { getMinimumWithdrawal } from './';

jest.mock('../../context/buildContext');

it.each<
  [
    Pick<SkybridgeParams<'withdrawal', 'test'>, 'amountDesired' | 'currencyReceiving'>,
    { minimumWithdrawal: string; minimumWithdrawalCurrency: SkybridgeCoin },
  ]
>([
  [
    { amountDesired: '0', currencyReceiving: 'BTC' },
    { minimumWithdrawal: '0.14807314', minimumWithdrawalCurrency: 'BTC' },
  ],
  [
    { amountDesired: '0', currencyReceiving: 'WBTC' },
    { minimumWithdrawal: '0.07403662', minimumWithdrawalCurrency: 'WBTC' },
  ],
  [
    { amountDesired: '200', currencyReceiving: 'WBTC' },
    { minimumWithdrawal: '0.07403662', minimumWithdrawalCurrency: 'WBTC' },
  ],
])('gets minimum withdrawal for %O', async ({ amountDesired, currencyReceiving }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getMinimumWithdrawal({ context, amountDesired, currencyReceiving });

  return expect(result).toMatchObject(expected);
});
