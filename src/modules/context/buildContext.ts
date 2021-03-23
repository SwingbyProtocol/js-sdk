import type { PartialDeep } from 'type-fest';

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
  return {
    mode,
    affiliateApi: affiliateApi ?? 'https://affiliate.swingby.network',
    servers: {
      ...servers,
      swapNode: {
        btc_erc:
          result[mode].swapNodes.btc_erc[randomInt(0, result[mode].swapNodes.btc_erc.length - 1)] ||
          null,
        btc_bep20:
          result[mode].swapNodes.btc_bep20[
            randomInt(0, result[mode].swapNodes.btc_bep20.length - 1)
          ] || null,
        ...servers?.swapNode,
      },
      indexer: {
        btc_erc:
          result[mode].indexerNodes.btc_erc[
            randomInt(0, result[mode].indexerNodes.btc_erc.length - 1)
          ] || null,
        btc_bep20:
          result[mode].indexerNodes.btc_bep20[
            randomInt(0, result[mode].indexerNodes.btc_bep20.length - 1)
          ] || null,
        ...servers?.indexer,
      },
    },
  };
};
