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
    { minimumWithdrawal: string; minimumWithdrawalCurrency: SkybridgeCoin },
  ]
>([
  [
    { bridge: 'btc_erc', amountDesired: '0', currencyReceiving: 'BTC' },
    { minimumWithdrawal: '0.0003006', minimumWithdrawalCurrency: 'BTC' },
  ],
  [
    { bridge: 'btc_erc', amountDesired: '0', currencyReceiving: 'WBTC' },
    { minimumWithdrawal: '0.0001503', minimumWithdrawalCurrency: 'WBTC' },
  ],
  [
    { bridge: 'btc_erc', amountDesired: '200', currencyReceiving: 'WBTC' },
    { minimumWithdrawal: '0.0001503', minimumWithdrawalCurrency: 'WBTC' },
  ],
  [
    { bridge: 'btc_bep20', amountDesired: '200', currencyReceiving: 'BTCB.BEP20' },
    { minimumWithdrawal: '0.00001503', minimumWithdrawalCurrency: 'BTCB.BEP20' },
  ],
  [
    { bridge: 'btc_bep20', amountDesired: '200', currencyReceiving: 'BTC' },
    { minimumWithdrawal: '0.0002004', minimumWithdrawalCurrency: 'BTC' },
  ],
])(
  'gets minimum withdrawal for %O',
  async ({ bridge, amountDesired, currencyReceiving }, expected) => {
    expect.assertions(1);

    const context = await buildContext({ mode: 'test' });
    const result = await getMinimumWithdrawal({
      context,
      bridge,
      amountDesired,
      currencyReceiving,
    });

    return expect(result).toMatchObject(expected);
  },
);
