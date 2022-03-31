import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { createFloat } from '.';

jest.mock('../../context/buildContext');

it.each<
  Pick<
    SkybridgeParams<'pool', 'production'>,
    'addressReceiving' | 'currencyDeposit' | 'amountDesired' | 'currencyReceiving'
  > & {
    expected: { addressReceiving: string };
  }
>([
  {
    amountDesired: '1',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyDeposit: 'BTC',
    currencyReceiving: 'sbBTC',
    expected: { addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc' },
  },
  {
    amountDesired: '1',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyDeposit: 'BTC',
    currencyReceiving: 'sbBTC',
    expected: { addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc' },
  },
  {
    amountDesired: '1',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyDeposit: 'BTC',
    currencyReceiving: 'sbBTC.SKYPOOL',
    expected: { addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc' },
  },
  {
    amountDesired: '1',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyDeposit: 'WBTC.SKYPOOL',
    currencyReceiving: 'sbBTC.SKYPOOL',
    expected: { addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc' },
  },
])(
  '"/floats/create" succeeds with %O',
  async ({ addressReceiving, currencyDeposit, amountDesired, currencyReceiving, expected }) => {
    jest.setTimeout(180000);
    expect.assertions(1);

    try {
      const context = await buildContext({ mode: 'production' });
      const result = await createFloat({
        context,
        addressReceiving,
        currencyDeposit,
        currencyReceiving,
        amountDesired,
      });
      return expect(result).toMatchObject({
        addressDeposit: expect.any(String),
        addressReceiving: expected.addressReceiving,
        amountDeposit: expect.stringContaining('0.99'),
        currencyDeposit,
        currencyReceiving,
        timestamp: expect.any(Date),
      });
    } catch (e: any) {
      expect(e.message).toMatch(/The KVStore key \d+ already exists in epoch bucket \d+/);
    }
  },
);
