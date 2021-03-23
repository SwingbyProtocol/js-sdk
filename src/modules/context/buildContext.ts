import type { PartialDeep } from 'type-fest';

import type { SkybridgeBridge } from '../bridges';
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
  const result = await getNetworkDetails();
  const getRandomNode = ({
    mode,
    bridge,
    from,
  }: {
    mode: M;
    bridge: SkybridgeBridge;
    from: 'swapNodes' | 'indexerNodes';
  }) => {
    try {
      return (
        result[mode][from][bridge][randomInt(0, result[mode][from][bridge].length - 1)] || null
      );
    } catch (e) {
      return null;
    }
  };

  return {
    mode,
    affiliateApi: affiliateApi ?? 'https://affiliate.swingby.network',
    servers: {
      ...servers,
      swapNode: {
        btc_erc: getRandomNode({ mode, bridge: 'btc_erc', from: 'swapNodes' }),
        btc_bep20: getRandomNode({ mode, bridge: 'btc_bep20', from: 'swapNodes' }),
        ...servers?.swapNode,
      },
      indexer: {
        btc_erc: getRandomNode({ mode, bridge: 'btc_erc', from: 'indexerNodes' }),
        btc_bep20: getRandomNode({ mode, bridge: 'btc_bep20', from: 'indexerNodes' }),
        ...servers?.indexer,
      },
    },
  };
};
