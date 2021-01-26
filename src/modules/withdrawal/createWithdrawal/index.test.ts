import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { createWithdrawal } from '.';

jest.mock('../../context/buildContext');

it.each<
  Pick<
    SkybridgeParams<'withdrawal', 'test'>,
    'addressReceiving' | 'currencyReceiving' | 'amountDesired'
  > & {
    expected: { addressReceiving: string };
  }
>([
  {
    amountDesired: '1',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyReceiving: 'WBTC',
    expected: { addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc' },
  },
  {
    amountDesired: '1',
    addressReceiving: 'tb1qu9xlvyrkj47t0cgu8e5kyanygec74zd9j2j9hh',
    currencyReceiving: 'BTC',
    expected: { addressReceiving: 'tb1qu9xlvyrkj47t0cgu8e5kyanygec74zd9j2j9hh' },
  },
])(
  '"/swaps/create" for withdrawals succeeds with %O',
  async ({ addressReceiving, currencyReceiving, amountDesired, expected }) => {
    jest.setTimeout(180000);
    expect.assertions(1);

    try {
      const context = await buildContext({ mode: 'test' });
      const result = await createWithdrawal({
        context,
        addressReceiving,
        currencyReceiving,
        amountDesired,
      });
      return expect(result).toMatchObject({
        addressDeposit: expect.any(String),
        addressReceiving: expected.addressReceiving,
        amountDeposit: expect.stringContaining('0.99'),
        currencyDeposit: 'sbBTC',
        currencyReceiving,
        timestamp: expect.any(Date),
      });
    } catch (e) {
      expect(e.message).toMatch(
        /(The KVStore key \d+ already exists in epoch bucket \d+)|(There is not enough [a-zA-Z]+ in float to perform your swap)/,
      );
    }
  },
);
