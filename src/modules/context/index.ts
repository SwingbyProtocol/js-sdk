import { Mode } from '../coins';

const NETWORKS = ['ethereum', 'binance'] as const;
export type Network = typeof NETWORKS[number];

export type ServersConfig<M extends Mode> = { readonly mode: M } & {
  readonly [N in Network]: {
    swap: string;
    explorer: string;
  };
};

export const calculateServers = async <M extends Mode>({
  mode,
}: {
  mode: M;
}): Promise<ServersConfig<M>> => {
  return { mode, ethereum: { swap: '', explorer: '' }, binance: { swap: '', explorer: '' } };
};
