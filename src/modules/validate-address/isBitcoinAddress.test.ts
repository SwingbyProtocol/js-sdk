import { buildContext } from '../context';
import { Mode } from '../modes';

import { isBitcoinAddress } from './isBitcoinAddress';

jest.mock('../context/buildContext');

type TestData = { address: string; expected: boolean; mode: Mode };

it.each<TestData>([
  { address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7', expected: true, mode: 'test' },
  { address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt7', expected: false, mode: 'production' },
  { address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt', expected: false, mode: 'test' },
  { address: 'tb1q0fzppaflhcju7emf9sh5n5st3c47mwuczwxmt', expected: false, mode: 'production' },
  { address: 'DummyAddress', expected: false, mode: 'test' },
  { address: 'tbnb18y6ak4nvd7u89dsyu205jhwaguluxt9l7fklsz', expected: false, mode: 'test' },
  { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', expected: false, mode: 'test' },
  { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', expected: true, mode: 'production' },
])('works for %O', async ({ address, expected, mode }) => {
  expect.assertions(1);

  const context = await buildContext({ mode });
  expect(isBitcoinAddress({ context, address })).toBe(expected);
});
