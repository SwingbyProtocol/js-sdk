import type { SkybridgeBridge } from '../bridges';
import type { SkybridgeMode } from '../modes';

import { buildContext } from './buildContext';

jest.mock('./getNetworkDetails', () => ({
  getNetworkDetails: ({ mode, bridge }: { mode: SkybridgeMode; bridge: SkybridgeBridge }) => {
    const prefix = `${mode}__${bridge}__`;
    return {
      swapNodes: [
        { restUri: `https://${prefix}swap-node`, lastSeenAt: '2021-05-05T00:00:00.000Z' },
      ],
      indexerNodes: [`${prefix}indexer-node`],
    };
  },
}));

const mode = 'test';

it('returns default according to result of getNetworkDetails()', () => {
  return expect(buildContext({ mode })).resolves.toMatchObject({
    affiliateApi: 'https://affiliate.swingby.network',
    mode,
    servers: {
      indexer: {
        btc_skypool: 'test__btc_skypool__indexer-node',
      },
      swapNode: {
        btc_skypool: 'https://test__btc_skypool__swap-node',
      },
    },
  });
});

it('allows overwriting affiliateApi', () => {
  return expect(buildContext({ mode, affiliateApi: 'my-value' })).resolves.toMatchObject({
    affiliateApi: 'my-value',
    mode,
    servers: {
      indexer: {
        btc_skypool: 'test__btc_skypool__indexer-node',
      },
      swapNode: {
        btc_skypool: 'https://test__btc_skypool__swap-node',
      },
    },
  });
});

it('allows overwriting affiliateApi with empty string', () => {
  return expect(buildContext({ mode, affiliateApi: '' })).resolves.toMatchObject({
    affiliateApi: '',
    mode,
    servers: {
      indexer: {
        btc_skypool: 'test__btc_skypool__indexer-node',
      },
      swapNode: {
        btc_skypool: 'https://test__btc_skypool__swap-node',
      },
    },
  });
});

it('allows overwriting one server', () => {
  return expect(
    buildContext({ mode, servers: { indexer: { btc_skypool: 'my-bep-a' } } }),
  ).resolves.toMatchObject({
    affiliateApi: 'https://affiliate.swingby.network',
    mode,
    servers: {
      indexer: { btc_skypool: 'my-bep-a' },
      swapNode: {
        btc_skypool: 'https://test__btc_skypool__swap-node',
      },
    },
  });
});

it('allows overwriting several servers', () => {
  return expect(
    buildContext({
      mode,
      servers: {
        indexer: { btc_skypool: 'my-i-bep-a' },
        swapNode: {},
      },
    }),
  ).resolves.toMatchObject({
    affiliateApi: 'https://affiliate.swingby.network',
    mode,
    servers: {
      indexer: { btc_skypool: 'my-i-bep-a' },
      swapNode: { btc_skypool: 'https://test__btc_skypool__swap-node' },
    },
  });
});
