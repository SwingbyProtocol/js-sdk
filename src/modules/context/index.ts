import { Mode } from '../modes';

const NETWORKS = ['ethereum', 'binance'] as const;
export type Network = typeof NETWORKS[number];

export type SwingbyContext<M extends Mode> = { readonly mode: M } & {
  readonly [N in Network]: {
    swap: string;
    explorer: string;
  };
};

export const buildContext = async <M extends Mode>({
  mode,
}: {
  mode: M;
}): Promise<SwingbyContext<M>> => {
  return { mode, ethereum: { swap: '', explorer: '' }, binance: { swap: '', explorer: '' } };
};
