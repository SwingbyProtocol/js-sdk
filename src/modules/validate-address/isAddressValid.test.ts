import { buildContext } from '../context';
import { Mode } from '../modes';
import { Network } from '../networks';

import { isAddressValid } from './isAddressValid';

jest.mock('../context/buildContext');

type TestData = { address: string; expected: boolean; mode: Mode; network?: Network };

it.each<TestData>([
  {
    address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    network: undefined,
    expected: true,
    mode: 'test',
  },
  {
    address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    network: 'bitcoin',
    expected: true,
    mode: 'test',
  },
  {
    address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7',
    network: 'binance',
    expected: false,
    mode: 'test',
  },
  {
    address: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7',
    network: undefined,
    expected: true,
    mode: 'test',
  },
  {
    address: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7',
    network: 'ethereum',
    expected: true,
    mode: 'test',
  },
  {
    address: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7',
    network: 'bitcoin',
    expected: false,
    mode: 'test',
  },
  {
    address: 'tbnb18y6ak4nvd7u89dsyu205jhwaguluxt9l7fklsz',
    network: undefined,
    expected: true,
    mode: 'test',
  },
  {
    address: 'tbnb18y6ak4nvd7u89dsyu205jhwaguluxt9l7fklsz',
    network: 'binance',
    expected: true,
    mode: 'test',
  },
  {
    address: 'tbnb18y6ak4nvd7u89dsyu205jhwaguluxt9l7fklsz',
    network: 'bitcoin',
    expected: false,
    mode: 'test',
  },
])('works for %O', async ({ address, network, expected, mode }) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  expect(isAddressValid({ context, address, network })).toBe(expected);
});
