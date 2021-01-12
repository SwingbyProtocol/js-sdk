import type { SkybridgeBridge } from '../bridges';
import { fetch } from '../fetch';
import type { SkybridgeMode } from '../modes';

import type { SkybridgeContext } from './SkybridgeContext';

const randomInt = (min: number, max: number) => Math.round(Math.random() * (max - min)) + min;

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
  >('https://network.skybridge.exchange/api/network');

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  return {
    mode,
    affiliateApi: mode === 'test' ? 'https://affiliate-app-testnet.swingby.vercel.app' : undefined,
    servers: {
      swapNode: {
        btc_erc:
          result.response[mode].swapNodes.btc_erc[
            randomInt(0, result.response[mode].swapNodes.btc_erc.length - 1)
          ],
        btc_bep:
          result.response[mode].swapNodes.btc_bep[
            randomInt(0, result.response[mode].swapNodes.btc_bep.length - 1)
          ],
      },
      indexer: {
        btc_erc:
          result.response[mode].indexerNodes.btc_erc[
            randomInt(0, result.response[mode].indexerNodes.btc_erc.length - 1)
          ],
        btc_bep:
          result.response[mode].indexerNodes.btc_bep[
            randomInt(0, result.response[mode].indexerNodes.btc_bep.length - 1)
          ],
      },
    },
  };
};
