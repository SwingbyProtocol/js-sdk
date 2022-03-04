import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';
import type { SkybridgeCoin } from '../../coins';
import type { SkybridgeBridge } from '../../bridges';

import { getMinimumWithdrawal } from './';

jest.mock('../../context/buildContext');

it.each<
  [
    Pick<SkybridgeParams<'withdrawal', 'test'>, 'amountDesired' | 'currencyReceiving'> & {
      bridge: SkybridgeBridge;
    },
    { minimumWithdrawalCurrency: SkybridgeCoin },
  ]
>([
  [
    { bridge: 'btc_erc', amountDesired: '0', currencyReceiving: 'BTC' },
    { minimumWithdrawalCurrency: 'BTC' },
  ],
  [
    { bridge: 'btc_erc', amountDesired: '0', currencyReceiving: 'WBTC' },
    { minimumWithdrawalCurrency: 'WBTC' },
  ],
  [
    { bridge: 'btc_erc', amountDesired: '200', currencyReceiving: 'WBTC' },
    { minimumWithdrawalCurrency: 'WBTC' },
  ],
])(
  'gets minimum withdrawal for %O',
  async ({ bridge, amountDesired, currencyReceiving }, expected) => {
    jest.setTimeout(180000);
    expect.assertions(1);

    const context = await buildContext({ mode: 'test' });
    const result = await getMinimumWithdrawal({
      context,
      bridge,
      amountDesired,
      currencyReceiving,
    });

    return expect(result).toMatchObject({
      ...expected,
      minimumWithdrawal: expect.stringMatching(/\d+(\.\d+)?/),
    });
  },
);
