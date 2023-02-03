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
        btc_skypool: 'https://btc-skypool-1.swingby.network',
      },
      indexer: {
        btc_skypool: 'https://indexer.swingby.network/bb-eth',
      },
    },
  };
};
