import { fetch } from '../fetch';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeParams, SkybridgeStatus } from '../common-params';
import type { SkybridgeResource } from '../resources';
import { SkybridgeCoin } from '../coins';
import { SkybridgeBridge } from '../bridges';

type ServerReturnType<R extends SkybridgeResource, M extends SkybridgeMode> = {
  items: Array<
    Pick<SkybridgeParams<R, M>, 'amountIn' | 'currencyIn' | 'currencyOut' | 'hash'> & {
      amountOut: string;
      feeCurrency: SkybridgeCoin<R, M>;
      addressDeposit: string;
      fee: string;
      status: SkybridgeStatus;
      txIdIn: string;
      txIdOut: string;
      timestamp: number;
      addressIn?: string;
      addressOut: string;
    }
  >;
};

type ReturnType<R extends SkybridgeResource, M extends SkybridgeMode> = R extends 'pool'
  ? Pick<
      SkybridgeParams<R, M>,
      | 'addressSwapIn'
      | 'addressUserIn'
      | 'amountIn'
      | 'amountOut'
      | 'currencyIn'
      | 'currencyOut'
      | 'hash'
      | 'status'
      | 'timestamp'
    > & {
      transactionInId: SkybridgeParams<R, M>['transactionInId'] | null;
    }
  : Pick<
      SkybridgeParams<R, M>,
      | 'addressSwapIn'
      | 'addressUserIn'
      | 'amountIn'
      | 'amountOut'
      | 'currencyIn'
      | 'currencyOut'
      | 'feeTotal'
      | 'feeCurrency'
      | 'hash'
      | 'status'
      | 'timestamp'
    > & {
      transactionInId: SkybridgeParams<R, M>['transactionInId'] | null;
      transactionOutId: SkybridgeParams<R, M>['transactionOutId'] | null;
    };

const bridgeCache = new Map<string, SkybridgeBridge>();

export const getDetails = async <R extends SkybridgeResource, M extends SkybridgeMode>({
  resource,
  context,
  hash,
}: { resource: R } & Pick<SkybridgeParams<R, M>, 'context' | 'hash'>): Promise<
  ReturnType<R, M>
> => {
  const result = await (async () => {
    const bridge = bridgeCache.get(hash);
    if (bridge) {
      try {
        const result = await fetch<ServerReturnType<R, M>>(
          `${context.servers.swapNode[bridge]}/api/v1/${
            resource === 'pool' ? 'floats' : 'swaps'
          }/query?hash=${hash}`,
        );

        if (result.ok && result.response.items.length > 0) {
          bridgeCache.set(hash, bridge);
          return result.response.items[0];
        }

        throw new Error();
      } catch (e) {
        throw new Error(`Could not find swap with hash "${hash}"`);
      }
    }

    const results = await Promise.all(
      (Object.keys(context.servers.swapNode) as SkybridgeBridge[]).map(async (bridge) => {
        try {
          const result = await fetch<ServerReturnType<R, M>>(
            `${context.servers.swapNode[bridge]}/api/v1/${
              resource === 'pool' ? 'floats' : 'swaps'
            }/query?hash=${hash}`,
          );

          if (result.ok && result.response.items.length > 0) {
            bridgeCache.set(hash, bridge);
            return result.response.items[0];
          }

          return null;
        } catch (e) {
          return null;
        }
      }),
    );

    const result = results.find((it) => !!it);
    if (!result) {
      throw new Error(`Could not find swap with hash "${hash}"`);
    }

    return result;
  })();

  if (resource === 'withdrawal' && result.currencyIn !== 'sbBTC') {
    throw new Error(`"${hash}" is not a withdrawal, it is a swap.`);
  }

  if (resource === 'swap' && result.currencyIn === 'sbBTC') {
    throw new Error(`"${hash}" is not a swap, it is a withdrawal.`);
  }

  return {
    addressUserIn: result.addressOut,
    addressSwapIn: result.addressDeposit,
    amountIn: result.amountIn,
    amountOut: result.amountOut || null,
    // Temporarily fixes API bug where it retuns `BTCE` instead of `WBTC`
    currencyIn: (result.currencyIn as any) === 'BTCE' ? 'WBTC' : result.currencyIn,
    currencyOut: (result.currencyOut as any) === 'BTCE' ? 'WBTC' : result.currencyOut,
    feeCurrency: ((result.feeCurrency as any) === 'BTCE' ? 'WBTC' : result.feeCurrency) || null,
    feeTotal: result.fee || null,
    hash: result.hash,
    status: result.status,
    transactionInId: result.txIdIn || null,
    transactionOutId: result.txIdOut || null,
    timestamp: new Date(result.timestamp * 1000),
  } as ReturnType<R, M>;
};
