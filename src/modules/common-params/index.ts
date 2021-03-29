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
  /** Address where the user sends funds from to start a swap. */
  addressSending: string | null;
  /** Address that users have to send funds to to initiate a swap. */
  addressDeposit: string;
  /** Amount that users type in the UI. */
  amountDesired: string;
  /** Amount that users have to send to Skybridge to start the swap. */
  amountDeposit: string;
  amountReceiving: string;
  currencyDeposit: SkybridgeCoin<R, M, 'in'>;
  currencyReceiving: SkybridgeCoin<R, M, 'out'>;
  nonce: number;
  timestamp: Date;
  /** e.g. `0.1` means `10%`. */
  feeBridgeFraction: string;
  /** In the units specified by `feeCurrency`. */
  feeMiner: string;
  feeCurrency: SkybridgeCoin<R, M, 'out'>;
  /** In the units specified by `feeCurrency`. */
  feeTotal: string;
  status: SkybridgeStatus;
  txDepositId: string;
  txReceivingId: string;
};
