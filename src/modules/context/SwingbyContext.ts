import type { Mode } from '../modes';
import type { Network } from '../networks';

export type SwingbyContext = {
  readonly mode: Mode;
  servers: {
    readonly [N in Network]: {
      swap: string;
      explorer: string;
    };
  };
};
