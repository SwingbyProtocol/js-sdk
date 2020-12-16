import { getBridgeFor } from '../context';
import { fetch } from '../fetch';
import { logger } from '../logger';
import { SkybridgeMode } from '../modes';
import { SkybridgeParams } from '../common-params';
import { runProofOfWork } from '../pow';
import { SkybridgeResource } from '../resources';

export type CreateParams<R extends SkybridgeResource, M extends SkybridgeMode> = {
  resource: R;
  /** Time in milliseconds that this method will retry in case of error before throwing. Default: `120000` (2 min.). */
  timeout?: number;
} & Pick<
  SkybridgeParams<R, M>,
  'context' | 'addressUserIn' | 'currencyIn' | 'currencyOut' | 'amountUser'
>;

export type CreateResult<R extends SkybridgeResource, M extends SkybridgeMode> = R extends 'pool'
  ? Pick<
      SkybridgeParams<R, M>,
      | 'addressSwapIn'
      | 'addressUserIn'
      | 'amountIn'
      | 'currencyIn'
      | 'currencyOut'
      | 'nonce'
      | 'timestamp'
      | 'hash'
    >
  : Pick<
      SkybridgeParams<R, M>,
      | 'addressSwapIn'
      | 'addressUserIn'
      | 'amountIn'
      | 'currencyIn'
      | 'currencyOut'
      | 'nonce'
      | 'timestamp'
      | 'hash'
      | 'amountOut'
    >;

const INTERVAL = 2000;

export const create = async <R extends SkybridgeResource, M extends SkybridgeMode>({
  timeout = 2 * 60 * 1000,
  ...params
}: CreateParams<R, M>): Promise<CreateResult<R, M>> =>
  createRec({ ...params, startedAt: Date.now(), timeout });

const createRec = async <R extends SkybridgeResource, M extends SkybridgeMode>({
  resource,
  startedAt,
  timeout,
  ...params
}: CreateParams<R, M> & { startedAt: number; timeout: number }): Promise<CreateResult<R, M>> => {
  logger('Will execute create(%O).', { ...params, resource, startedAt, timeout });

  const apiPathResource = resource === 'pool' ? 'floats' : 'swaps';
  const { amountIn, nonce } = await runProofOfWork(params);

  type ApiResponse = Pick<
    SkybridgeParams<R, M>,
    'amountIn' | 'amountOut' | 'currencyIn' | 'currencyOut' | 'nonce' | 'hash'
  > & { timestamp: number; addressDeposit: string; addressOut: string };

  const bridge = getBridgeFor(params);
  const result = await fetch<ApiResponse>(
    `${params.context.servers.swapNode[bridge]}/api/v1/${apiPathResource}/create`,
    {
      method: 'post',
      body: JSON.stringify({
        address_to: params.addressUserIn,
        amount: amountIn,
        currency_from: params.currencyIn,
        currency_to: params.currencyOut,
        nonce,
      }),
    },
  );

  logger(`/${apiPathResource}/create has replied: %O`, result);

  if (result.ok) {
    return {
      amountIn: result.response.amountIn,
      amountOut: result.response.amountOut,
      currencyIn: result.response.currencyIn,
      currencyOut: result.response.currencyOut,
      hash: result.response.hash,
      nonce: result.response.nonce,
      addressSwapIn: result.response.addressDeposit,
      addressUserIn: result.response.addressOut,
      timestamp: new Date(result.response.timestamp * 1000),
    } as CreateResult<R, M>;
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
      createRec({ ...params, startedAt, timeout, resource })
        .then(resolve)
        .catch(reject);
    }, INTERVAL);
  });
};