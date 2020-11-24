import { getNetwork } from '../../context';
import { fetch } from '../../fetch';
import { Mode } from '../../modes';
import { CommonSwapParams } from '../../swap-params';

import { calculateSwap } from './calculateSwap';

type Params<M extends Mode> = Pick<
  CommonSwapParams<M>,
  'context' | 'addressOut' | 'currencyIn' | 'currencyOut' | 'amountUser'
>;

type Result<M extends Mode> = Pick<
  CommonSwapParams<M>,
  'addressIn' | 'addressOut' | 'amountIn' | 'currencyIn' | 'currencyOut' | 'nonce' | 'timestamp'
>;

export const createSwap = async <M extends Mode>({
  context,
  currencyOut,
  currencyIn,
  addressOut,
  amountUser,
}: Params<M>): Promise<Result<M>> => {
  const { amountIn, nonce } = await calculateSwap({
    context,
    addressOut,
    amountUser,
    currencyIn,
    currencyOut,
  });

  type ApiResponse = Pick<
    CommonSwapParams<M>,
    'addressIn' | 'addressOut' | 'amountIn' | 'currencyIn' | 'currencyOut' | 'nonce'
  > & { timestamp: number };

  const network = getNetwork({ currencyIn, currencyOut });
  const result = await fetch<ApiResponse>(`${context.servers[network].swap}/api/v1/swaps/create`, {
    method: 'post',
    body: JSON.stringify({
      address_to: addressOut,
      amount: amountIn,
      currency_from: currencyIn,
      currency_to: currencyOut,
      nonce,
    }),
  });

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  return { ...result.response, timestamp: new Date(result.response.timestamp * 1000) };
};
