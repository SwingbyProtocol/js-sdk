import { buildContext } from '../../context';
import type { SkybridgeParams } from '../../common-params';

import { getSwapDetails } from './';

jest.mock('../../context/buildContext');

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 'sQmT1Q1RROVwVLxs2wJWa5ZVa49zFIBr-9jC_wJsyqM=' },
])('gets swaps details for %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getSwapDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc',
    addressDeposit: 'msEKP7ZSma3rQtWSQBBZCiJAvjAaowf2c6',
    amountDeposit: '0.00099289',
    amountReceiving: '0.0007409',
    currencyDeposit: 'BTC',
    currencyReceiving: 'WBTC',
    feeCurrency: 'WBTC',
    feeTotal: '0.00025199',
    hash,
    status: 'COMPLETED',
    txDepositId: 'e474cb45766526d71a08ad3e31efecb27d4bc17cfed93a9bc864102a4ce6f831',
    txReceivingId: '0x18140256bab379b282a152d93effd8ace0301bbefb48d3cd41e8a0d51daab79f',
    timestamp: new Date('2020-12-22T15:48:48.000Z'),
  });
});

it.each<Pick<SkybridgeParams<'swap', 'test'>, 'hash'>>([
  { hash: 't2CaqiS60g0wEyGXgrYi4nwKWw8F7dJRNQPAceWVx8I=' },
])('works for withdrawal %O', async ({ hash }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getSwapDetails({ context, hash });

  return expect(result).toMatchObject({
    addressReceiving: '0x3f4341a0599f63f444b6f1e0c7c5caf81b5843cc',
    addressDeposit: '0x13001cb1C8dbB605Ba7Ba438c7103988D3d16B71',
    amountDeposit: '0.00098851',
    amountReceiving: '0.00073653',
    currencyDeposit: 'sbBTC',
    currencyReceiving: 'WBTC',
    feeCurrency: 'WBTC',
    feeTotal: '0.00025198',
    hash,
    status: 'COMPLETED',
    txDepositId: '0xa772b0ec48c436f82739e69ed624f8f5427afac6bbaa70361a67490340b762fc',
    txReceivingId: null,
    timestamp: new Date('2020-12-22T16:26:08.000Z'),
  });
});
