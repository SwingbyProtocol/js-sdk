import { fetch } from '../fetch';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeParams, SkybridgeStatus } from '../common-params';
import type { SkybridgeResource } from '../resources';
import { fromApiCoin, SkybridgeCoin } from '../coins';
import { SkybridgeBridge } from '../bridges';
import { estimateSwapRewards } from '../generic-rewards';

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
      skypools?: boolean;
    }
  >;
};

type ReturnType<R extends SkybridgeResource, M extends SkybridgeMode> = Pick<
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
  | 'feeTotal'
  | 'feeCurrency'
  | 'addressSending'
  | 'isSkypoolsSwap'
  | 'rebalanceRewards'
> & {
  txDepositId: SkybridgeParams<R, M>['txDepositId'] | null;
  txReceivingId: SkybridgeParams<R, M>['txReceivingId'] | null;
};

const bridgeCache = new Map<string, SkybridgeBridge>();
const rebalanceRewardsCache = new Map<string, string>();

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
          return { bridge, data: result.response.items[0] };
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
            return { bridge, data: result.response.items[0] };
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

  if (resource === 'withdrawal' && !/^sbBTC/.test(result.data.currencyIn)) {
    throw new Error(`"${hash}" is not a withdrawal, it is a swap.`);
  }

  const rebalanceRewards: string = await (async () => {
    const cache = rebalanceRewardsCache.get(hash);
    if (cache) return cache;

    const swapRewardsResult = await estimateSwapRewards({
      context,
      amountDesired: result.data.amountIn,
      currencyDeposit: fromApiCoin({ bridge: result.bridge, coin: result.data.currencyIn as any }),
      currencyReceiving: fromApiCoin({ bridge: result.bridge, coin: result.data.currencyOut as any }),
    });

    rebalanceRewardsCache.set(hash, swapRewardsResult.amountReceiving);
    return swapRewardsResult.amountReceiving;
  })();


  return ({
    addressReceiving: result.data.addressOut,
    addressDeposit: result.data.addressDeposit,
    addressSending: result.data.addressIn || null,
    amountDeposit: result.data.amountIn,
    amountReceiving: result.data.amountOut || null,
    // Temporarily fixes API bug where it retuns `BTCE` instead of `WBTC`
    currencyDeposit: fromApiCoin({ bridge: result.bridge, coin: result.data.currencyIn as any }),
    currencyReceiving: fromApiCoin({ bridge: result.bridge, coin: result.data.currencyOut as any }),
    hash: result.data.hash || undefined,
    status: result.data.status,
    txDepositId: result.data.txIdIn || null,
    txReceivingId: result.data.txIdOut || null,
    timestamp: new Date(result.data.timestamp * 1000),
    feeCurrency: fromApiCoin({
      bridge: result.bridge,
      coin: (result.data.feeCurrency as any) || null,
    }),
    feeTotal: result.data.fee,
    rebalanceRewards,
    isSkypoolsSwap: resource === 'swap' && result.data.skypools === true,
  } as unknown) as ReturnType<R, M>;
};
