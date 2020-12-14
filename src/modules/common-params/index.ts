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

export type CommonSwapParams<M extends SkybridgeMode> = {
  context: SwingbyContext;
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
  currencyIn: SkybridgeCoin<M>;
  currencyOut: SkybridgeCoin<M>;
  nonce: number;
  timestamp: Date;
  /** e.g. `0.1` means `10%`. */
  feeBridgePercent: string;
  /** In the units specified by `feeCurrency`. */
  feeMiner: string;
  feeCurrency: SkybridgeCoin<M>;
  /** In the units specified by `feeCurrency`. */
  feeTotal: string;
  status: SwapStatus;
  transactionInId: string;
  transactionOutId: string;
};

export type CommonFloatParams<M extends SkybridgeMode> = Omit<
  CommonSwapParams<M>,
  'currencyIn' | 'currencyOut'
> & { currencyIn: 'BTC' | 'WBTC'; currencyOut: 'sbBTC' };

export type CommonAnyParams<M extends SkybridgeMode> = CommonFloatParams<M> | CommonSwapParams<M>;
