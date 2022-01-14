import { FIXED_NODE_ENDPOINT } from '../endpoints';
import type { SkybridgeBridge } from '../bridges';
import { fetcher } from '../fetch';
import type { SkybridgeMode } from '../modes';
import { SkybridgePeer } from '../common-params';

const NODE_STATUSES = [
  'churned-in',
  'may-churn-in',
  'may-churn-out--bond-too-low',
  'may-churn-out--bond-expiring',
  'inactive--bond-too-low',
  'inactive--bond-expired',
  'unreachable',
] as const;

// Todo: remove from this library
export type NodeStatus = typeof NODE_STATUSES[number];

export const getNetworkNodes = async ({
  mode,
  bridge,
}: {
  mode: SkybridgeMode;
  bridge: SkybridgeBridge;
}) => {
  const base = FIXED_NODE_ENDPOINT[bridge][mode][0];
  const url = base + '/api/v1/peers';
  const peers = await fetcher<SkybridgePeer[]>(url);
  return peers;
};
