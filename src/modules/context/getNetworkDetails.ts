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
  [k in SkybridgeMode]: { [k in SkybridgeBridge]: string };
} = {
  production: {
    btc_erc: 'https://indexer.swingby.network/bb-eth',
    btc_bep20: 'https://indexer.swingby.network/bb-bsc',
  },
  test: {
    btc_erc: 'https://tbtc-ropsten-node-1.swingby.network/bb-eth',
    btc_bep20: 'https://tbtc-bsc-1.swingby.network/bb-bsc',
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
    indexerNode: NETWORK_INFO[mode][bridge],
    swapNodes: await getNetworkNodes({ mode, bridge }),
  };
};
