import { getBridgeFor } from '../../context';
import { fetch } from '../../fetch';
import { logger } from '../../logger';
import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { runProofOfWork } from '../../pow';

type Params<M extends SkybridgeMode> = Pick<
  SkybridgeParams<'float', M>,
  'context' | 'addressUserIn' | 'currencyIn' | 'amountUser'
>;

type Result<M extends SkybridgeMode> = Pick<
  SkybridgeParams<'float', M>,
  | 'addressSwapIn'
  | 'addressUserIn'
  | 'amountIn'
  | 'currencyIn'
  | 'currencyOut'
  | 'nonce'
  | 'timestamp'
  | 'hash'
>;

const INTERVAL = 2000;

export const createFloat = async <M extends SkybridgeMode>({
  timeout = 2 * 60 * 1000,
  ...params
}: Params<M> & {
  /** Time in milliseconds that this method will retry in case of error before throwing. Default: `120000` (2 min.). */
  timeout?: number;
}): Promise<Result<M>> => createSwapRec({ ...params, startedAt: Date.now(), timeout });

const createSwapRec = async <M extends SkybridgeMode>({
  startedAt,
  timeout,
  ...params
}: Params<M> & { startedAt: number; timeout: number }): Promise<Result<M>> => {
  logger('Will execute createSwap(%O).', params);

  const { amountIn, nonce } = await runProofOfWork({ ...params, currencyOut: 'sbBTC' });

  type ApiResponse = Pick<
    SkybridgeParams<'float', M>,
    'amountIn' | 'amountOut' | 'currencyIn' | 'currencyOut' | 'nonce' | 'hash'
  > & { timestamp: number; addressDeposit: string; addressOut: string };

  const bridge = getBridgeFor({ ...params, currencyOut: 'sbBTC' });
  const result = await fetch<ApiResponse>(
    `${params.context.servers.swapNode[bridge]}/api/v1/floats/create`,
    {
      method: 'post',
      body: JSON.stringify({
        address_to: params.addressUserIn,
        amount: amountIn,
        currency_from: params.currencyIn,
        nonce,
      }),
    },
  );

  logger('/swaps/create has replied: %O', result);

  if (result.ok) {
    console.log('heyyy', result.response);
    return {
      ...result.response,
      addressSwapIn: result.response.addressDeposit,
      addressUserIn: result.response.addressOut,
      timestamp: new Date(result.response.timestamp * 1000),
    };
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
