import type { Mode } from '../modes';

import type { SwingbyContext } from './SwingbyContext';

export const buildContext = async <M extends Mode>({
  mode,
}: {
  mode: M;
}): Promise<SwingbyContext<M>> => {
  return {
    mode,
    servers: { ethereum: { swap: '', explorer: '' }, binance: { swap: '', explorer: '' } },
  };
};
