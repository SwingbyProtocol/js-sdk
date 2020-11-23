import { buildContext } from '../context';
import { Mode } from '../modes';

import { isEthereumAddress } from './isEthereumAddress';

jest.mock('../context/buildContext');

type TestData = { address: string; expected: boolean; mode: Mode };

it.each<TestData>([
  { address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7', expected: false, mode: 'test' },
  { address: 'tbnb18y6ak4nvd7u89dsyu205jhwaguluxt9l7fklsz', expected: false, mode: 'test' },
  { address: 'DummyAddress', expected: false, mode: 'test' },
  { address: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7', expected: true, mode: 'test' },
  { address: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7', expected: true, mode: 'production' },
  { address: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a71', expected: false, mode: 'test' },
])('works for %O', async ({ address, expected, mode }) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  expect(isEthereumAddress({ context, address })).toBe(expected);
});
