import { Coin, Mode } from '../coins';
import { ServersConfig } from '../endpoints';

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
