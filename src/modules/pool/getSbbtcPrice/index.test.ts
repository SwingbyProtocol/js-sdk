import { buildContext } from '../../context';

import { getSbbtcPrice } from './';

jest.mock('../../context/buildContext');

it('gets sbBTC price', async () => {
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getSbbtcPrice({ context });

  return expect(result).toMatch(/^(1|0)(\.[0-9]+)?/);
});
