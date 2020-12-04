import type { Bridge } from '../bridges';
import { fetch } from '../fetch';
import type { Mode } from '../modes';

import type { SwingbyContext } from './SwingbyContext';

export const buildContext = async <M extends Mode>({
  mode,
}: {
  mode: M;
}): Promise<SwingbyContext<M>> => {
  const result = await fetch<
    {
      [k in Mode]: {
        explorers: string[];
        swapNodes: { [k in Bridge]: string[] };
        indexerNodes: { [k in Bridge]: string[] };
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
