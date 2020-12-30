import type { SkybridgeCoin } from '../../coins';
import { buildContext } from '../../context';
import type { SkybridgeMode } from '../../modes';
import { SkybridgeResource } from '../../resources';

import { estimateAmountReceiving } from '.';

jest.mock('../../context/buildContext');

it.each<
  [
    {
      amountDesired: string;
      currencyDeposit: SkybridgeCoin<SkybridgeResource, 'test', 'in'>;
      currencyReceiving: SkybridgeCoin<SkybridgeResource, 'test', 'out'>;
    },
    any,
  ]
>([
  // [
  //   { amountDesired: '1', currencyDeposit: 'BTC', currencyReceiving: 'BTCB' },
  //   {
  //     amountReceiving: '0.998995',
  //     feeBridgeFraction: '0.001',
  //     feeMiner: '0.000005',
  //     feeCurrency: 'BTCB',
  //     feeTotal: '0.001005',
  //   },
  // ],
  [
    { amountDesired: '3', currencyDeposit: 'BTC', currencyReceiving: 'WBTC' },
    {
      amountReceiving: '2.99385',
      feeBridgeFraction: '0.002',
      feeMiner: '0.00015',
      feeCurrency: 'WBTC',
      feeTotal: '0.00615',
    },
  ],
  [
    { amountDesired: '156', currencyDeposit: 'WBTC', currencyReceiving: 'BTC' },
    {
      amountReceiving: '155.68799',
      feeBridgeFraction: '0.002',
      feeMiner: '0.00001',
      feeCurrency: 'BTC',
      feeTotal: '0.31201',
    },
  ],
  [
    { amountDesired: '156', currencyDeposit: 'sbBTC', currencyReceiving: 'WBTC' },
    {
      amountReceiving: '155.68785',
      feeBridgeFraction: '0.002',
      feeMiner: '0.00015',
      feeCurrency: 'WBTC',
      feeTotal: '0.31215',
    },
  ],
  [
    { amountDesired: '156', currencyDeposit: 'BTC', currencyReceiving: 'sbBTC' },
    {
      amountReceiving: '155.68785',
      feeBridgeFraction: '0.002',
      feeMiner: '0.00015',
      feeCurrency: 'sbBTC',
      feeTotal: '0.31215',
    },
  ],
])('works for %O', async ({ amountDesired, currencyDeposit, currencyReceiving }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await estimateAmountReceiving({
    context,
    currencyDeposit,
    currencyReceiving,
    amountDesired,
  });

  expect(result).toMatchObject(expected);
});

it.each<{ currencyDeposit: any; mode: SkybridgeMode; currencyReceiving: any }>([
  { currencyDeposit: 'WBTC', mode: 'test', currencyReceiving: 'BTCB' },
  { currencyDeposit: 'BTCB', mode: 'test', currencyReceiving: 'WBTC' },
  { currencyDeposit: 'BTC', mode: 'production', currencyReceiving: 'BTCB' },
])('throws for %O', async ({ currencyDeposit, mode, currencyReceiving }) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  try {
    await estimateAmountReceiving({
      context,
      currencyDeposit,
      currencyReceiving,
      amountDesired: '1',
    });
  } catch (e) {
    expect(e.message).toMatch(/Could not find (test|production) bridge for/);
  }
});
