import { Mode } from '../../coins';
import { fetch } from '../../fetch';
import { CommonSwapParams } from '../common-param-types';

type Params<M extends Mode> = Pick<
  CommonSwapParams<M>,
  'context' | 'addressOut' | 'amountIn' | 'currencyIn' | 'currencyOut' | 'nonce'
>;

type Result<M extends Mode> = Pick<
  CommonSwapParams<M>,
  'addressIn' | 'addressOut' | 'amountIn' | 'currencyIn' | 'currencyOut' | 'nonce' | 'timestamp'
>;

export const createSwap = async <M extends Mode>(params: Params<M>): Promise<Result<M>> => {
  type ApiResponse = Pick<
    CommonSwapParams<M>,
    'addressIn' | 'addressOut' | 'amountIn' | 'currencyIn' | 'currencyOut' | 'nonce'
  > & { timestamp: number };

  const result = await fetch<ApiResponse>(`${params.context.binance.swap}/api/v1/swaps/create`, {
    method: 'post',
    body: JSON.stringify({
      address_to: params.addressOut,
      amount: params.amountIn,
      currency_from: params.currencyIn,
      currency_to: params.currencyOut,
      nonce: params.nonce,
    }),
  });

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  return { ...result.response, timestamp: new Date(result.response.timestamp * 1000) };
};
