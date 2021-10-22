import type { SkybridgeBridge } from '../bridges';
import type { SkybridgeMode } from '../modes';

import { getNetworkNodes } from './getNetworkNodes';

const NODE_STATUSES = [
  'churned-in',
  'may-churn-in',
  'may-churn-out--bond-too-low',
  'may-churn-out--bond-expiring',
  'inactive--bond-too-low',
  'inactive--bond-expired',
  'unreachable',
] as const;
export type NodeStatus = typeof NODE_STATUSES[number];

const NETWORK_INFO: {
  [k in SkybridgeMode]: { [k in SkybridgeBridge]: { indexerNodes: string[] } };
} = {
  production: {
    btc_erc: {
      indexerNodes: ['https://indexer.swingby.network/bb-eth'],
    },
    btc_bep20: {
      indexerNodes: ['https://indexer.swingby.network/bb-bsc'],
    },
  },
  test: {
    btc_erc: { indexerNodes: ['https://tbtc-ropsten-node-1.swingby.network/bb-eth'] },
    btc_bep20: { indexerNodes: ['https://tbtc-bsc-1.swingby.network/bb-bsc'] },
  },
};

export const getNetworkDetails = async ({
  mode,
  bridge,
}: {
  mode: SkybridgeMode;
  bridge: SkybridgeBridge;
}) => {
  return {
    indexerNodes: NETWORK_INFO[mode][bridge].indexerNodes,
    swapNodes: await getNetworkNodes({ mode, bridge }),
  };
};
