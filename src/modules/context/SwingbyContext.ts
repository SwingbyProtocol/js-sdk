import type { Mode } from '../modes';
import type { Bridge } from '../bridges';

export type SwingbyContext<M extends Mode = Mode> = {
  readonly mode: M;
  readonly servers: {
    readonly swapNode: { readonly [k in Bridge]: string };
    readonly indexer: { readonly [k in Bridge]: string };
  };
};
