import type { Mode } from '../modes';

import type { SwingbyContext } from './SwingbyContext';

export const buildContext = async ({ mode }: { mode: Mode }): Promise<SwingbyContext> => {
  return {
    mode,
    servers: {
      swapNode: {
        btc_erc: 'https://tbtc-goerli-1.swingby.network',
        btc_bep: 'https://testnet-node.swingby.network',
      },
      indexer: {
        btc_erc: 'https://indexer-goerli.swingby.network',
        btc_bep: 'https://indexer-tbtc.swingby.network',
      },
    },
  };
};
