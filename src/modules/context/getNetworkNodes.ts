import type { SkybridgeBridge } from '../bridges';
import type { SkybridgeMode } from '../modes';
import { fetcher } from '../fetch';
import { DateTime } from 'luxon';

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

export const getNetworkNodes = async ({
  mode,
  bridge,
}: {
  mode: SkybridgeMode;
  bridge: SkybridgeBridge;
}) => {
  return (
    await fetcher<
      Array<{
        id: string;
        moniker: string;
        restUri: string;
        lastSeenAt: string;
        status: NodeStatus;
        version: string;
        p2pHost: string;
        ip: string;
        regionCode: string | null;
        regionName: string | null;
        addresses: [string, string];
        bondAddress: string;
        bondAmount: string;
        bondExpiresAt: string;
      }>
    >(`https://skybridge-network-api.vercel.app/api/v3/${mode}/${bridge}/nodes`)
  ).map((it) => ({
    ...it,
    lastSeenAt: DateTime.fromISO(it.lastSeenAt).toJSDate(),
    bondExpiresAt: DateTime.fromISO(it.bondExpiresAt).toJSDate(),
  }));
};
