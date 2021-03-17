import type { SkybridgeContext } from '..';
import type { SkybridgeMode } from '../../modes';

export const buildContext = async <M extends SkybridgeMode>({
  mode,
}: {
  mode: M;
}): Promise<SkybridgeContext<M>> => {
  return {
    mode,
    affiliateApi: 'https://affiliate.swingby.network',
    servers: {
      swapNode: {
        btc_erc: 'https://tbtc-goerli-node-1.swingby.network',
        btc_bep20: 'https://tbtc-bsc-1.swingby.network',
      },
      indexer: {
        btc_erc: 'https://eth-indexer-testnet-sw1.swingby.network',
        btc_bep20: 'https://tbtc-bsc-1.swingby.network/bb-bsc',
      },
    },
  };
};
