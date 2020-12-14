import type { SkybridgeAction } from '../actions';
import type { SkybridgeCoin } from '../coins';
import type { SwingbyContext } from '../context';
import type { SkybridgeMode } from '../modes';

const STATUSES = [
  'WAITING',
  'PENDING',
  'SIGNING',
  'SENDING',
  'COMPLETED',
  'SIGNING_REFUND',
  'SENDING_REFUND',
  'REFUNDED',
  'EXPIRED',
] as const;
export type SwapStatus = typeof STATUSES[number];

export type SkybridgeParams<
  A extends SkybridgeAction = SkybridgeAction,
  M extends SkybridgeMode = SkybridgeMode
> = {
  context: SwingbyContext<M>;
  /** Unique identifier for a swap. */
  hash: string;
  /** Address the user has sent funds from. */
  addressUserOut: string;
  /** Address where the user will receive their funds after the swap. */
  addressUserIn: string;
  /** Address that users have to send funds to to initiate a swap. */
  addressSwapIn: string;
  /** Amount that users type in the UI. */
  amountUser: string;
  /** Amount that users have to send to Swingby to start the swap. */
  amountIn: string;
  amountOut: string;
  currencyIn: SkybridgeCoin<A, M, 'in'>;
  currencyOut: SkybridgeCoin<A, M, 'out'>;
  nonce: number;
  timestamp: Date;
  /** e.g. `0.1` means `10%`. */
  feeBridgePercent: string;
  /** In the units specified by `feeCurrency`. */
  feeMiner: string;
  feeCurrency: SkybridgeCoin<A, M, 'out'>;
  /** In the units specified by `feeCurrency`. */
  feeTotal: string;
  status: SwapStatus;
  transactionInId: string;
  transactionOutId: string;
};
