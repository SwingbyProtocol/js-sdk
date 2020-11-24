import { buildContext } from '../context';
import { Mode } from '../modes';

import { isBinanceAddress } from './isBinanceAddress';

jest.mock('../context/buildContext');

type TestData = { address: string; expected: boolean; mode: Mode };

it.each<TestData>([
  { address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7', expected: false, mode: 'test' },
  { address: 'DummyAddress', expected: false, mode: 'test' },
  { address: '0xb680c8F33f058163185AB6121F7582BAb57Ef8a7', expected: false, mode: 'test' },
  { address: 'tbnb18y6ak4nvd7u89dsyu205jhwaguluxt9l7fklsz', expected: true, mode: 'test' },
  { address: 'tbnb18y6ak4nvd7u89dsyu205jhwaguluxt9l7fklsz', expected: false, mode: 'production' },
  { address: 'bnb1asnv2dvsd64z25n6u5mh2838kmghq3a7876htr', expected: false, mode: 'test' },
  { address: 'bnb1asnv2dvsd64z25n6u5mh2838kmghq3a7876htr', expected: true, mode: 'production' },
])('works for %O', async ({ address, expected, mode }) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  expect(isBinanceAddress({ context, address })).toBe(expected);
});