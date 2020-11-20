import type { Coin } from '../coins';
import type { SwingbyContext } from '../context';
import type { Mode } from '../modes';

export type CommonSwapParams<M extends Mode> = {
  context: SwingbyContext<M>;
  addressIn: string;
  addressOut: string;
  /** Amount that users type in the UI. */
  amountUser: string;
  /** Amount that users have to send to Swingby to start the swap. */
  amountIn: string;
  amountOut: string;
  currencyIn: Coin<M>;
  currencyOut: Coin<M>;
  nonce: number;
  timestamp: Date;
  /** e.g. `0.1` means `10%`. */
  bridgeFeePercent: string;
  /** In the units specified by `feeCurrency`. */
  minerFee: string;
  feeCurrency: Coin<M>;
  /** In the units specified by `feeCurrency`. */
  totalFee: string;
};
