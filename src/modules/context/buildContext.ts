import type { Mode } from '../modes';

import type { SwingbyContext } from './SwingbyContext';

export const buildContext = async ({ mode }: { mode: Mode }): Promise<SwingbyContext> => {
  return {
    mode,
    servers: {
      btc_erc: {
        swap: 'https://tbtc-goerli-1.swingby.network',
        explorer: 'https://indexer-goerli.swingby.network',
      },
      btc_bep: {
        swap: 'https://testnet-node.swingby.network',
        explorer: '',
      },
    },
  };
};
