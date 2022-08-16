import type { SkybridgeCoin } from '../../coins';
import { buildContext } from '../../context';
import type { SkybridgeMode } from '../../modes';
import { SkybridgeResource } from '../../resources';

import { estimateSwapRewards } from '.';

jest.mock('../../context/buildContext');

it.each<
  [
    {
      amountDesired: string;
      currencyDeposit: SkybridgeCoin<SkybridgeResource, 'production', 'in'>;
      currencyReceiving: SkybridgeCoin<SkybridgeResource, 'production', 'out'>;
    },
  ]
>([
  [{ amountDesired: '3', currencyDeposit: 'BTC', currencyReceiving: 'WBTC' }],
  [{ amountDesired: '156', currencyDeposit: 'WBTC', currencyReceiving: 'BTC' }],
  [{ amountDesired: '156', currencyDeposit: 'sbBTC', currencyReceiving: 'WBTC' }],
  [{ amountDesired: '156', currencyDeposit: 'BTC', currencyReceiving: 'sbBTC' }],
  [{ amountDesired: '156', currencyDeposit: 'WBTC.SKYPOOL', currencyReceiving: 'sbBTC.SKYPOOL' }],
])('works for %O', async ({ amountDesired, currencyDeposit, currencyReceiving }) => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'production' });
  const result = await estimateSwapRewards({
    context,
    currencyDeposit,
    currencyReceiving,
    amountDesired,
  });

  expect(result).toMatchObject({
    price: expect.stringMatching(/\d+(\.\d+)?/),
    rebateRate: expect.stringMatching(/\d+(\.\d+)?/),
    amountReceiving: expect.stringMatching(/\d+(\.\d+)?/),
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
    await estimateSwapRewards({
      context,
      currencyDeposit,
      currencyReceiving,
      amountDesired: '1',
    });
  } catch (e: any) {
    expect(e.message).toMatch(/(Could not find (test|production) bridge)|(must be one of)/);
  }
});
