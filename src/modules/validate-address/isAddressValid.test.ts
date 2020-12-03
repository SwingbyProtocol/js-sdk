import { buildContext } from '../context';
import type { Mode } from '../modes';
import type { Chain } from '../chains';

import { isAddressValid } from './isAddressValid';

jest.mock('../context/buildContext');

type TestData = { address: string; expected: boolean; mode: Mode; chain?: Chain };

it.each<TestData>([
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
    address: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7',
    chain: undefined,
    expected: true,
    mode: 'test',
  },
  {
    address: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7',
    chain: 'ethereum',
    expected: true,
    mode: 'test',
  },
  {
    address: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7',
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
