import { buildContext } from './buildContext';

jest.mock('./getNetworkDetails', () => ({
  getNetworkDetails: () => ({
    test: {
      explorers: ['explorer-a'],
      swapNodes: {
        btc_erc: ['swap-erc-a'],
        btc_bep20: ['swap-bep-a'],
      },
      indexerNodes: {
        btc_erc: ['indexer-erc-a'],
        btc_bep20: ['indexer-bep-a'],
      },
    },
  }),
}));

const mode = 'test';

it('returns default according to result of getNetworkDetails()', () => {
  return expect(buildContext({ mode })).resolves.toMatchObject({
    affiliateApi: 'https://affiliate.swingby.network',
    mode,
    servers: {
      indexer: { btc_bep20: 'indexer-bep-a', btc_erc: 'indexer-erc-a' },
      swapNode: { btc_bep20: 'swap-bep-a', btc_erc: 'swap-erc-a' },
    },
  });
});

it('allows overwriting affiliateApi', () => {
  return expect(buildContext({ mode, affiliateApi: 'my-value' })).resolves.toMatchObject({
    affiliateApi: 'my-value',
    mode,
    servers: {
      indexer: { btc_bep20: 'indexer-bep-a', btc_erc: 'indexer-erc-a' },
      swapNode: { btc_bep20: 'swap-bep-a', btc_erc: 'swap-erc-a' },
    },
  });
});

it('allows overwriting affiliateApi with empty string', () => {
  return expect(buildContext({ mode, affiliateApi: '' })).resolves.toMatchObject({
    affiliateApi: '',
    mode,
    servers: {
      indexer: { btc_bep20: 'indexer-bep-a', btc_erc: 'indexer-erc-a' },
      swapNode: { btc_bep20: 'swap-bep-a', btc_erc: 'swap-erc-a' },
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
      indexer: { btc_bep20: 'my-bep-a', btc_erc: 'indexer-erc-a' },
      swapNode: { btc_bep20: 'swap-bep-a', btc_erc: 'swap-erc-a' },
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
      swapNode: { btc_bep20: 'swap-bep-a', btc_erc: 'my-s-erc-a' },
    },
  });
});
