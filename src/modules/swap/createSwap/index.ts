import { getNetwork } from '../../context';
import { fetch } from '../../fetch';
import { logger } from '../../logger';
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

export const createSwap = async <M extends Mode>(params: Params<M>): Promise<Result<M>> =>
  createSwapRec({ ...params, pastExecutions: 0 });

const createSwapRec = async <M extends Mode>({
  pastExecutions,
  ...params
}: Params<M> & { pastExecutions: number }): Promise<Result<M>> => {
  logger('Will execute createSwap(%O). Past executions: "%d".', params, pastExecutions);

  const { amountIn, nonce } = await calculateSwap(params);

  type ApiResponse = Pick<
    CommonSwapParams<M>,
    'addressIn' | 'addressOut' | 'amountIn' | 'currencyIn' | 'currencyOut' | 'nonce'
  > & { timestamp: number };

  const network = getNetwork(params);
  const result = await fetch<ApiResponse>(
    `${params.context.servers[network].swap}/api/v1/swaps/create`,
    {
      method: 'post',
      body: JSON.stringify({
        address_to: params.addressOut,
        amount: amountIn,
        currency_from: params.currencyIn,
        currency_to: params.currencyOut,
        nonce,
      }),
    },
  );

  if (!result.ok) {
    if (/the send amount does not contain a valid proof of work/.test(result.response)) {
      return createSwapRec({ ...params, pastExecutions: pastExecutions + 1 });
    }

    throw new Error(`${result.status}: ${result.response}`);
  }

  return { ...result.response, timestamp: new Date(result.response.timestamp * 1000) };
};
