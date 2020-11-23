import type { Mode } from '../modes';

import type { SwingbyContext } from './SwingbyContext';

export const buildContext = async <M extends Mode>({
  mode,
}: {
  mode: M;
}): Promise<SwingbyContext<M>> => {
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
