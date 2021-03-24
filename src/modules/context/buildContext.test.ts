import type { SkybridgeBridge } from '../bridges';
import type { SkybridgeMode } from '../modes';

import { buildContext } from './buildContext';

jest.mock('./getNetworkDetails', () => ({
  getNetworkDetails: ({ mode, bridge }: { mode: SkybridgeMode; bridge: SkybridgeBridge }) => {
    const prefix = `${mode}__${bridge}__`;
    return {
      explorers: [`${prefix}explorer`],
      swapNodes: [`${prefix}swap-node`],
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
        btc_bep20: 'test__btc_bep20__indexer-node',
        btc_erc: 'test__btc_erc__indexer-node',
      },
      swapNode: { btc_bep20: 'test__btc_bep20__swap-node', btc_erc: 'test__btc_erc__swap-node' },
    },
  });
});

it('allows overwriting affiliateApi', () => {
  return expect(buildContext({ mode, affiliateApi: 'my-value' })).resolves.toMatchObject({
    affiliateApi: 'my-value',
    mode,
    servers: {
      indexer: {
        btc_bep20: 'test__btc_bep20__indexer-node',
        btc_erc: 'test__btc_erc__indexer-node',
      },
      swapNode: { btc_bep20: 'test__btc_bep20__swap-node', btc_erc: 'test__btc_erc__swap-node' },
    },
  });
});

it('allows overwriting affiliateApi with empty string', () => {
  return expect(buildContext({ mode, affiliateApi: '' })).resolves.toMatchObject({
    affiliateApi: '',
    mode,
    servers: {
      indexer: {
        btc_bep20: 'test__btc_bep20__indexer-node',
        btc_erc: 'test__btc_erc__indexer-node',
      },
      swapNode: { btc_bep20: 'test__btc_bep20__swap-node', btc_erc: 'test__btc_erc__swap-node' },
    },
  });
});

it('allows overwriting one server', () => {
  return expect(
    buildContext({ mode, servers: { indexer: { btc_bep20: 'my-bep-a' } } }),
  ).resolves.toMatchObject({
    affiliateApi: 'https://affiliate.swingby.network',
    mode,
    servers: {
      indexer: { btc_bep20: 'my-bep-a', btc_erc: 'test__btc_erc__indexer-node' },
      swapNode: { btc_bep20: 'test__btc_bep20__swap-node', btc_erc: 'test__btc_erc__swap-node' },
    },
  });
});

it('allows overwriting several servers', () => {
  return expect(
    buildContext({
      mode,
      servers: {
        indexer: { btc_bep20: 'my-i-bep-a', btc_erc: 'my-i-erc-a' },
        swapNode: { btc_erc: 'my-s-erc-a' },
      },
    }),
  ).resolves.toMatchObject({
    affiliateApi: 'https://affiliate.swingby.network',
    mode,
    servers: {
      indexer: { btc_bep20: 'my-i-bep-a', btc_erc: 'my-i-erc-a' },
      swapNode: { btc_bep20: 'test__btc_bep20__swap-node', btc_erc: 'my-s-erc-a' },
    },
  });
});
