import type { SkybridgeBridge } from '../bridges';
import type { SkybridgeCoin } from '../coins';
import type { SkybridgeMode } from '../modes';

import { buildContext } from './buildContext';
import { getBridgeFor } from './getBridgeFor';

jest.mock('./buildContext');

it.each<{
  mode: SkybridgeMode;
  currencyReceiving: SkybridgeCoin;
  currencyDeposit: SkybridgeCoin;
  expected: SkybridgeBridge;
}>([
  { mode: 'test', currencyDeposit: 'WBTC', currencyReceiving: 'BTC', expected: 'btc_erc' },
  { mode: 'test', currencyDeposit: 'BTC', currencyReceiving: 'WBTC', expected: 'btc_erc' },
  { mode: 'test', currencyDeposit: 'BTC', currencyReceiving: 'sbBTC', expected: 'btc_erc' },
  { mode: 'test', currencyDeposit: 'sbBTC', currencyReceiving: 'BTC', expected: 'btc_erc' },
])('works for %O', async ({ mode, currencyReceiving, currencyDeposit, expected }) => {
  expect.assertions(1);
  const context = await buildContext({ mode });
  expect(getBridgeFor({ context, currencyReceiving, currencyDeposit })).toBe(expected);
});

it.each<{
  mode: SkybridgeMode;
  currencyReceiving: SkybridgeCoin;
  currencyDeposit: SkybridgeCoin;
}>([{ mode: 'test', currencyDeposit: 'BTC', currencyReceiving: 'fake coin' as any }])(
  'throws for %O',
  async ({ mode, currencyReceiving, currencyDeposit }) => {
    expect.assertions(1);
    const context = await buildContext({ mode });
    try {
      getBridgeFor({ context, currencyReceiving, currencyDeposit });
    } catch (e: any) {
      expect(e.message).toMatch(/Could not find (test|production) bridge for/);
    }
  },
);
