import { Coin, Mode } from '../coins';
import { ServersConfig } from '../context';

export type CommonSwapParams<M extends Mode> = {
  servers: ServersConfig<M>;
  addressIn: string;
  addressOut: string;
  amountIn: string;
  amountOut: string;
  currencyIn: Coin<M>;
  currencyOut: Coin<M>;
  nonce: number;
  timestamp: Date;
};
