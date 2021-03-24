import type { SkybridgeBridge } from '../bridges';
import type { SkybridgeMode } from '../modes';
import { fetcher } from '../fetch';

export const getNetworkDetails = async ({
  mode,
  bridge,
}: {
  mode: SkybridgeMode;
  bridge: SkybridgeBridge;
}) => {
  const result = await fetcher<{
    explorers: string[];
    swapNodes: string[];
    indexerNodes: string[];
  }>(`https://network.skybridge.exchange/api/v2/${mode}/${bridge}/network`);

  return result;
};
