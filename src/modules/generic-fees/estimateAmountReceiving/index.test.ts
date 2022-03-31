import type { PromiseValue } from 'type-fest';

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
      currencyDeposit: SkybridgeCoin<SkybridgeResource, 'production', 'in'>;
      currencyReceiving: SkybridgeCoin<SkybridgeResource, 'production', 'out'>;
    },
    Pick<PromiseValue<ReturnType<typeof estimateAmountReceiving>>, 'feeCurrency'>,
  ]
>([
  [
    { amountDesired: '3', currencyDeposit: 'BTC', currencyReceiving: 'WBTC' },
    { feeCurrency: 'WBTC' },
  ],
  [
    { amountDesired: '156', currencyDeposit: 'WBTC', currencyReceiving: 'BTC' },
    { feeCurrency: 'BTC' },
  ],
  [
    { amountDesired: '156', currencyDeposit: 'sbBTC', currencyReceiving: 'WBTC' },
    { feeCurrency: 'WBTC' },
  ],
  [
    { amountDesired: '156', currencyDeposit: 'BTC', currencyReceiving: 'sbBTC' },
    { feeCurrency: 'sbBTC' },
  ],
  [
    { amountDesired: '156', currencyDeposit: 'WBTC.SKYPOOL', currencyReceiving: 'sbBTC.SKYPOOL' },
    { feeCurrency: 'sbBTC.SKYPOOL' },
  ],
])('works for %O', async ({ amountDesired, currencyDeposit, currencyReceiving }, expected) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'production' });
  const result = await estimateAmountReceiving({
    context,
    currencyDeposit,
    currencyReceiving,
    amountDesired,
  });

  expect(result).toMatchObject({
    ...expected,
    amountReceiving: expect.stringMatching(/\d+(\.\d+)?/),
    feeBridgeFraction: expect.stringMatching(/\d+(\.\d+)?/),
    feeMiner: expect.stringMatching(/\d+(\.\d+)?/),
    feeTotal: expect.stringMatching(/\d+(\.\d+)?/),
  });
});

it.each<{ currencyDeposit: any; mode: SkybridgeMode; currencyReceiving: any }>([
  { currencyDeposit: 'WBTC', mode: 'production', currencyReceiving: 'BTCB' },
  { currencyDeposit: 'BTCB', mode: 'production', currencyReceiving: 'WBTC' },
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
  } catch (e: any) {
    expect(e.message).toMatch(/(Could not find (test|production) bridge)|(must be one of)/);
  }
});
