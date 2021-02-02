import type { SkybridgeBridge } from '../bridges';
import { fetch } from '../fetch';
import type { SkybridgeMode } from '../modes';

export const getNetworkDetails = async () => {
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

  return result.response;
};
