import { SkybridgeBridge, SKYBRIDGE_BRIDGES } from '../../bridges';
import { buildContext } from '../../context';

import { getSbbtcPrice } from './';

jest.mock('../../context/buildContext');

it.each<SkybridgeBridge>(SKYBRIDGE_BRIDGES)('gets sbBTC price for %j', async (bridge) => {
  jest.setTimeout(180000);
  expect.assertions(1);

  const context = await buildContext({ mode: 'test' });
  const result = await getSbbtcPrice({ context, bridge });

  return expect(result).toMatch(/^(1|0)(\.[0-9]+)?/);
});
