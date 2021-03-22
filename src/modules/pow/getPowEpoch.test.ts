import type { SkybridgeBridge } from '../bridges';

import { getPowEpoch } from './getPowEpoch';

it.each<{ blockHeight: number; bridge: SkybridgeBridge; expected: number }>([
  {
    blockHeight: 100,
    bridge: 'btc_erc',
    expected: 34,
  },
  {
    blockHeight: 99,
    bridge: 'btc_erc',
    expected: 34,
  },
  {
    blockHeight: 100,
    bridge: 'btc_bep20',
    expected: 7,
  },
  {
    blockHeight: 99,
    bridge: 'btc_bep20',
    expected: 7,
  },
])('works for %s', ({ blockHeight, bridge, expected }) => {
  expect(getPowEpoch({ blockHeight, bridge })).toBe(expected);
});
