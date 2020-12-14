import type { SkybridgeContext } from '..';
import type { SkybridgeMode } from '../../modes';

export const buildContext = async <M extends SkybridgeMode>({
  mode,
}: {
  mode: M;
}): Promise<SkybridgeContext<M>> => {
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
