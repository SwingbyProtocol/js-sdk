import type { SkybridgeMode } from '../modes';
import type { SkybridgeBridge } from '../bridges';

export type SwingbyContext<M extends SkybridgeMode = SkybridgeMode> = {
  readonly mode: M;
  readonly servers: {
    readonly swapNode: { readonly [k in SkybridgeBridge]: string };
    readonly indexer: { readonly [k in SkybridgeBridge]: string };
  };
};
