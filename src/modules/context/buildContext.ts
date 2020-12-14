import type { SkybridgeBridge } from '../bridges';
import { fetch } from '../fetch';
import type { SkybridgeMode } from '../modes';

import type { SkybridgeContext } from './SkybridgeContext';

export const buildContext = async <M extends SkybridgeMode>({
  mode,
}: {
  mode: M;
}): Promise<SkybridgeContext<M>> => {
  const result = await fetch<
    {
      [k in SkybridgeMode]: {
        explorers: string[];
        swapNodes: { [k in SkybridgeBridge]: string[] };
        indexerNodes: { [k in SkybridgeBridge]: string[] };
      };
    }
  >('https://seed-kappa.vercel.app/api/network');

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  return {
    mode,
    servers: {
      swapNode: {
        btc_erc: result.response[mode].swapNodes.btc_erc[0],
        btc_bep: result.response[mode].swapNodes.btc_bep[0],
      },
      indexer: {
        btc_erc: result.response[mode].indexerNodes.btc_erc[0],
        btc_bep: result.response[mode].indexerNodes.btc_bep[0],
      },
    },
  };
};
