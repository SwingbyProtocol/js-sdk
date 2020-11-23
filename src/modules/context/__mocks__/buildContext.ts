import type { SwingbyContext } from '..';
import type { Mode } from '../../modes';

export const buildContext = async ({ mode }: { mode: Mode }): Promise<SwingbyContext> => {
  return {
    mode,
    servers: {
      ethereum: {
        swap: 'https://tbtc-goerli-1.swingby.network',
        explorer: 'https://indexer-goerli.swingby.network',
      },
      binance: {
        swap: 'https://testnet-node.swingby.network',
        explorer: '',
      },
      bitcoin: {
        swap: 'https://indexer-tbtc.swingby.network',
        explorer: 'https://indexer-goerli.swingby.network',
      },
    },
  };
};
