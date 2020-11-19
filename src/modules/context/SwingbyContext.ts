import type { Mode } from '../modes';
import type { Network } from '../networks';

export type SwingbyContext<M extends Mode> = {
  readonly mode: M;
  servers: {
    readonly [N in Network]: {
      swap: string;
      explorer: string;
    };
  };
};
