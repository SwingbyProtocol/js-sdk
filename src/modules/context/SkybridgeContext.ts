import type { SkybridgeMode } from '../modes';
import type { SkybridgeBridge } from '../bridges';

export type SkybridgeContext<M extends SkybridgeMode = SkybridgeMode> = {
  readonly mode: M;
  readonly affiliateApi: string;
  readonly servers: {
    readonly swapNode: { readonly [k in SkybridgeBridge]: string | null };
    readonly indexer: { readonly [k in SkybridgeBridge]: string | null };
  };
};
