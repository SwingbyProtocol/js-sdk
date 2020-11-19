import { Coin } from '../coins';
import { SwingbyContext } from '../context';
import { Mode } from '../modes';

export type CommonSwapParams<M extends Mode> = {
  context: SwingbyContext<M>;
  addressIn: string;
  addressOut: string;
  amountIn: string;
  amountOut: string;
  currencyIn: Coin<M>;
  currencyOut: Coin<M>;
  nonce: number;
  timestamp: Date;
};
