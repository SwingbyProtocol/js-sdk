import { buildContext } from '../context';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeChain } from '../chains';

import { isAddressValid } from './isAddressValid';

jest.mock('../context/buildContext');

type TestData = { address: string; expected: boolean; mode: SkybridgeMode; chain?: SkybridgeChain };

it.each<TestData>([
  {
    address: 'bc1qgsrm7gaav7edmua42deq3lxenpywnjhl7wmv5h',
    chain: undefined,
    expected: true,
    mode: 'production',
  },
  {
    address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    chain: undefined,
    expected: true,
    mode: 'test',
  },
  {
    address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    chain: 'bitcoin',
    expected: true,
    mode: 'test',
  },
  {
    address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    chain: 'binance',
    expected: false,
    mode: 'test',
  },
  {
    address: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    chain: undefined,
    expected: true,
    mode: 'test',
  },
  {
    address: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    chain: 'ethereum',
    expected: true,
    mode: 'test',
  },
  {
    address: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    chain: 'bitcoin',
    expected: false,
    mode: 'test',
  },
  {
    address: 'tbnb18y6ak4nvd7u89dsyu205jhwaguluxt9l7fklsz',
    chain: undefined,
    expected: true,
    mode: 'test',
  },
  {
    address: 'tbnb18y6ak4nvd7u89dsyu205jhwaguluxt9l7fklsz',
    chain: 'binance',
    expected: true,
    mode: 'test',
  },
  {
    address: 'tbnb18y6ak4nvd7u89dsyu205jhwaguluxt9l7fklsz',
    chain: 'bitcoin',
    expected: false,
    mode: 'test',
  },
])('works for %O', async ({ address, chain, expected, mode }) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  expect(isAddressValid({ context, address, chain })).toBe(expected);
});
