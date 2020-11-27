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
  | 'addressIn'
  | 'addressOut'
  | 'amountIn'
  | 'currencyIn'
  | 'currencyOut'
  | 'nonce'
  | 'timestamp'
  | 'hash'
>;

const INTERVAL = 2000;

export const createSwap = async <M extends Mode>({
  timeout = 2 * 60 * 1000,
  ...params
}: Params<M> & {
  /** Time in milliseconds that this method will retry in case of error before throwing. Default: `120000` (2 min.). */
  timeout?: number;
}): Promise<Result<M>> => createSwapRec({ ...params, startedAt: Date.now(), timeout });

const createSwapRec = async <M extends Mode>({
  startedAt,
  timeout,
  ...params
}: Params<M> & { startedAt: number; timeout: number }): Promise<Result<M>> => {
  logger('Will execute createSwap(%O).', params);

  const { amountIn, nonce } = await calculateSwap(params);

  type ApiResponse = Pick<
    CommonSwapParams<M>,
    'addressIn' | 'addressOut' | 'amountIn' | 'currencyIn' | 'currencyOut' | 'nonce' | 'hash'
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

  logger('/swaps/create has replied: %O', result);

  if (result.ok) {
    return { ...result.response, timestamp: new Date(result.response.timestamp * 1000) };
  }

  if (!/the send amount does not contain a valid proof of work/.test(result.response)) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  if (Date.now() - startedAt > timeout) {
    logger('PoW has been failing for more than %dms. Will throw error.', timeout);
    throw new Error(`${result.status}: ${result.response}`);
  }

  logger('PoW failed. Will try again in %dms.', INTERVAL);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      createSwapRec({ ...params, startedAt, timeout })
        .then(resolve)
        .catch(reject);
    }, INTERVAL);
  });
};