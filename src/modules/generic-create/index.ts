import { Big } from 'big.js';

import { getBridgeFor } from '../context';
import { fetch } from '../fetch';
import { baseLogger } from '../logger';
import { SkybridgeMode } from '../modes';
import { SkybridgeParams } from '../common-params';
import { runProofOfWork } from '../pow';
import { SkybridgeResource } from '../resources';
import { getChainFor } from '../chains';
import { toApiCoin, fromApiCoin, SkybridgeApiCoin } from '../coins';

const logger = baseLogger.extend('generic-create');

export type CreateParams<R extends SkybridgeResource, M extends SkybridgeMode> = {
  resource: R;
  /** Time in milliseconds that this method will retry in case of error before throwing. Default: `30000` (30 seconds). */
  timeout?: number;
} & Pick<
  SkybridgeParams<R, M>,
  'context' | 'addressReceiving' | 'currencyDeposit' | 'currencyReceiving' | 'amountDesired'
> & {
    isSkypoolsSwap?: SkybridgeParams<R, M>['isSkypoolsSwap'] | undefined;
  };

export type CreateResult<R extends SkybridgeResource, M extends SkybridgeMode> = R extends 'pool'
  ? Pick<
      SkybridgeParams<R, M>,
      | 'addressDeposit'
      | 'addressReceiving'
      | 'amountDeposit'
      | 'currencyDeposit'
      | 'currencyReceiving'
      | 'nonce'
      | 'timestamp'
      | 'hash'
      | 'isSkypoolsSwap'
    >
  : Pick<
      SkybridgeParams<R, M>,
      | 'addressDeposit'
      | 'addressReceiving'
      | 'amountDeposit'
      | 'currencyDeposit'
      | 'currencyReceiving'
      | 'nonce'
      | 'timestamp'
      | 'hash'
      | 'amountReceiving'
      | 'isSkypoolsSwap'
    >;

const INTERVAL = 2000;

export const create = async <R extends SkybridgeResource, M extends SkybridgeMode>({
  timeout = 30 * 1000,
  ...params
}: CreateParams<R, M>): Promise<CreateResult<R, M>> =>
  createRec({ ...params, startedAt: Date.now(), timeout });

const createRec = async <R extends SkybridgeResource, M extends SkybridgeMode>({
  resource,
  startedAt,
  timeout,
  isSkypoolsSwap,
  ...params
}: CreateParams<R, M> & { startedAt: number; timeout: number }): Promise<CreateResult<R, M>> => {
  logger('Will execute create(%j).', { ...params, resource, startedAt, timeout });
  const bridge = getBridgeFor(params);

  await (async () => {
    const result = await fetch<Array<{ amount: string; currency: SkybridgeApiCoin }>>(
      `${params.context.servers.swapNode[bridge]}/api/v1/floats/balances`,
    );

    if (!result.ok) {
      throw new Error(`${result.status}: ${result.response}`);
    }

    const item = result.response.find((it) => {
      try {
        return fromApiCoin({ coin: it.currency, bridge }) === params.currencyReceiving;
      } catch (e) {
        return false;
      }
    });
    if (!item) {
      logger('Could not find balance for "%s"', params.currencyReceiving);
      return;
    }

    if (new Big(params.amountDesired).gte(item.amount)) {
      throw new Error(
        `There is not enough ${params.currencyReceiving} liquidity to perform your swap.`,
      );
    }
  })();

  const apiPathResource = resource === 'pool' ? 'floats' : 'swaps';
  const { amountDeposit, nonce } = await runProofOfWork(params);

  type ApiResponse = Pick<SkybridgeParams<R, M>, 'addressDeposit' | 'nonce' | 'hash'> & {
    amountIn: string;
    amountOut: string;
    currencyIn: SkybridgeApiCoin;
    currencyOut: SkybridgeApiCoin;
    timestamp: number;
    addressOut: string;
    skypools?: boolean;
  };

  const result = await fetch<ApiResponse>(
    `${params.context.servers.swapNode[bridge]}/api/v1/${apiPathResource}/create`,
    {
      method: 'post',
      body: JSON.stringify({
        address_to:
          getChainFor({ coin: params.currencyReceiving }) === 'ethereum'
            ? params.addressReceiving.toLowerCase()
            : params.addressReceiving,
        amount: amountDeposit,
        currency_from: toApiCoin({ coin: params.currencyDeposit }),
        currency_to: toApiCoin({ coin: params.currencyReceiving }),
        nonce,
        skypools: isSkypoolsSwap === true,
      }),
    },
  );

  logger('/%s/create has replied: %j', apiPathResource, result);

  if (result.ok) {
    return {
      amountDeposit: result.response.amountIn,
      amountReceiving: result.response.amountOut,
      currencyDeposit: fromApiCoin({ bridge, coin: result.response.currencyIn }),
      currencyReceiving: fromApiCoin({ bridge, coin: result.response.currencyOut }),
      hash: result.response.hash,
      nonce: result.response.nonce,
      addressDeposit: result.response.addressDeposit,
      addressReceiving: result.response.addressOut,
      timestamp: new Date(result.response.timestamp * 1000),
      isSkypoolsSwap: resource === 'swap' && result.response.skypools === true,
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
