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
        btc_erc: 'https://btc-wbtc-mainnet.quantexe.com',
      },
      indexer: {
        btc_erc: 'https://indexer.swingby.network/bb-eth',
      },
    },
  };
};
