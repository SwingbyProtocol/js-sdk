import { fetch } from '../fetch';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeParams, SkybridgeStatus } from '../common-params';
import type { SkybridgeResource } from '../resources';
import { SkybridgeCoin } from '../coins';
import { SkybridgeBridge } from '../bridges';

type ServerReturnType<R extends SkybridgeResource, M extends SkybridgeMode> = {
  items: Array<
    Pick<SkybridgeParams<R, M>, 'hash'> & {
      currencyIn: SkybridgeCoin<R, M, 'in'>;
      currencyOut: SkybridgeCoin<R, M, 'out'>;
      amountIn: string;
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
      | 'addressDeposit'
      | 'addressReceiving'
      | 'amountDeposit'
      | 'amountReceiving'
      | 'currencyDeposit'
      | 'currencyReceiving'
      | 'hash'
      | 'status'
      | 'timestamp'
    > & {
      txDepositId: SkybridgeParams<R, M>['txDepositId'] | null;
    }
  : Pick<
      SkybridgeParams<R, M>,
      | 'addressDeposit'
      | 'addressReceiving'
      | 'amountDeposit'
      | 'amountReceiving'
      | 'currencyDeposit'
      | 'currencyReceiving'
      | 'feeTotal'
      | 'feeCurrency'
      | 'hash'
      | 'status'
      | 'timestamp'
    > & {
      txDepositId: SkybridgeParams<R, M>['txDepositId'] | null;
      txReceivingId: SkybridgeParams<R, M>['txReceivingId'] | null;
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
    addressReceiving: result.addressOut,
    addressDeposit: result.addressDeposit,
    amountDeposit: result.amountIn,
    amountReceiving: result.amountOut || null,
    // Temporarily fixes API bug where it retuns `BTCE` instead of `WBTC`
    currencyDeposit: (result.currencyIn as any) === 'BTCE' ? 'WBTC' : result.currencyIn,
    currencyReceiving: (result.currencyOut as any) === 'BTCE' ? 'WBTC' : result.currencyOut,
    feeCurrency: ((result.feeCurrency as any) === 'BTCE' ? 'WBTC' : result.feeCurrency) || null,
    feeTotal: result.fee || null,
    hash: result.hash,
    status: result.status,
    txDepositId: result.txIdIn || null,
    txReceivingId: result.txIdOut || null,
    timestamp: new Date(result.timestamp * 1000),
  } as ReturnType<R, M>;
};
