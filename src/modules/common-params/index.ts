import type { SkybridgeResource } from '../resources';
import type { SkybridgeCoin } from '../coins';
import type { SkybridgeContext } from '../context';
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
export type SkybridgeStatus = typeof STATUSES[number];

export type SkybridgeParams<
  R extends SkybridgeResource = SkybridgeResource,
  M extends SkybridgeMode = SkybridgeMode
> = {
  context: SkybridgeContext<M>;
  /** Unique identifier for a swap. */
  hash: string;
  /** Address where the user will receive their funds after the swap. */
  addressReceiving: string;
  /** Address that users have to send funds to to initiate a swap. */
  addressDeposit: string;
  /** Amount that users type in the UI. */
  amountUser: string;
  /** Amount that users have to send to Skybridge to start the swap. */
  amountDeposit: string;
  amountOut: string;
  currencyIn: SkybridgeCoin<R, M, 'in'>;
  currencyOut: SkybridgeCoin<R, M, 'out'>;
  nonce: number;
  timestamp: Date;
  /** e.g. `0.1` means `10%`. */
  feeBridgePercent: string;
  /** In the units specified by `feeCurrency`. */
  feeMiner: string;
  feeCurrency: SkybridgeCoin<R, M, 'out'>;
  /** In the units specified by `feeCurrency`. */
  feeTotal: string;
  status: SkybridgeStatus;
  transactionInId: string;
  transactionOutId: string;
};
