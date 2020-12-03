import type { SwingbyContext } from '..';
import type { Mode } from '../../modes';

export const buildContext = async <M extends Mode>({
  mode,
}: {
  mode: M;
}): Promise<SwingbyContext<M>> => {
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
