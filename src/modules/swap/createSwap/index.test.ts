import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { createSwap } from './';

jest.mock('../../context/buildContext');

it.each<
  Pick<
    SkybridgeParams<'swap', 'test'>,
    'addressReceiving' | 'currencyDeposit' | 'currencyReceiving' | 'amountDesired'
  > & { expected: { addressReceiving: string } }
>([
  {
    amountDesired: '0.02950426',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    expected: { addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc' },
  },
  {
    amountDesired: '0.1',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    expected: { addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc' },
  },
  {
    amountDesired: '0.1',
    addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    currencyDeposit: 'BTC',
    currencyReceiving: 'BTCB.BEP20',
    expected: { addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc' },
  },
])(
  '"/swaps/create" succeeds with %O',
  async ({ addressReceiving, currencyDeposit, currencyReceiving, amountDesired, expected }) => {
    jest.setTimeout(180000);
    expect.assertions(1);

    try {
      const context = await buildContext({ mode: 'test' });
      const result = await createSwap({
        context,
        addressReceiving,
        currencyDeposit,
        currencyReceiving,
        amountDesired,
      });

      expect(result).toMatchObject({
        addressDeposit: expect.any(String),
        addressReceiving: expected.addressReceiving,
        amountDeposit: expect.any(String),
        amountReceiving: expect.any(String),
        currencyDeposit,
        currencyReceiving,
        timestamp: expect.any(Date),
      });
    } catch (e) {
      expect(e.message).toMatch(/The KVStore key \d+ already exists in epoch bucket \d+/);
    }
  },
);

it('crashes if there is not enough balance of the receiving currency', async () => {
  expect.assertions(1);

  try {
    const context = await buildContext({ mode: 'test' });
    await createSwap({
      context,
      addressReceiving: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
      currencyDeposit: 'BTC',
      currencyReceiving: 'WBTC',
      amountDesired: '100',
    });
  } catch (e) {
    expect(e.message).toMatch(/There is not enough WBTC in float to perform your swap/);
  }
});
