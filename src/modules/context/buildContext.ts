import type { PartialDeep } from 'type-fest';

import { SkybridgeBridge, SKYBRIDGE_BRIDGES } from '../bridges';
import type { SkybridgeMode } from '../modes';

import { getNetworkDetails } from './getNetworkDetails';
import type { SkybridgeContext } from './SkybridgeContext';

const randomInt = (min: number, max: number) => Math.round(Math.random() * (max - min)) + min;

export const buildContext = async <M extends SkybridgeMode>({
  mode,
  servers,
  affiliateApi,
}: {
  mode: M;
} & PartialDeep<Omit<SkybridgeContext<M>, 'mode'>>): Promise<SkybridgeContext<M>> => {
  const results = await Promise.all(
    SKYBRIDGE_BRIDGES.map((bridge) => getNetworkDetails({ mode, bridge })),
  );

  const getRandomNode = ({
    bridge,
    from,
  }: {
    bridge: SkybridgeBridge;
    from: 'swapNodes' | 'indexerNodes';
  }) => {
    const index = SKYBRIDGE_BRIDGES.findIndex((it) => it === bridge);
    try {
      return results[index][from][randomInt(0, results[index][from].length - 1)] || null;
    } catch (e) {
      console.error('wat', e, JSON.stringify(results));
      return null;
    }
  };

  return {
    mode,
    affiliateApi: affiliateApi ?? 'https://affiliate.swingby.network',
    servers: {
      ...servers,
      swapNode: {
        btc_erc: getRandomNode({ bridge: 'btc_erc', from: 'swapNodes' }),
        btc_bep20: getRandomNode({ bridge: 'btc_bep20', from: 'swapNodes' }),
        ...servers?.swapNode,
      },
      indexer: {
        btc_erc: getRandomNode({ bridge: 'btc_erc', from: 'indexerNodes' }),
        btc_bep20: getRandomNode({ bridge: 'btc_bep20', from: 'indexerNodes' }),
        ...servers?.indexer,
      },
    },
  };
};
