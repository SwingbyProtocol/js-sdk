import type { Mode } from '../modes';
import type { Bridge } from '../bridges';

export type SwingbyContext = {
  readonly mode: Mode;
  servers: {
    readonly [N in Bridge]: {
      swap: string;
      explorer: string;
    };
  };
};
