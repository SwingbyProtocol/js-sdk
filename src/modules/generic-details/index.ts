import { fetch } from '../fetch';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeParams, SkybridgeStatus } from '../common-params';
import type { SkybridgeResource } from '../resources';

type ServerReturnType<R extends SkybridgeResource, M extends SkybridgeMode> = {
  items: Array<
    Pick<
      SkybridgeParams<R, M>,
      'amountIn' | 'amountOut' | 'currencyIn' | 'currencyOut' | 'feeCurrency' | 'hash'
    > & {
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

export const getDetails = async <R extends SkybridgeResource, M extends SkybridgeMode>({
  resource,
  context,
  hash,
}: { resource: R } & Pick<SkybridgeParams<R, M>, 'context' | 'hash'>): Promise<
  Pick<
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
    addressUserOut: SkybridgeParams<R, M>['addressUserOut'] | null;
    transactionInId: SkybridgeParams<R, M>['transactionInId'] | null;
    transactionOutId: SkybridgeParams<R, M>['transactionOutId'] | null;
  }
> => {
  const result = await (async () => {
    const ethereumFetch = fetch<ServerReturnType<R, M>>(
      `${context.servers.swapNode.btc_bep}/api/v1/${
        resource === 'pool' ? 'floats' : 'swaps'
      }/query?hash=${hash}`,
    );
    const binanceFetch = fetch<ServerReturnType<R, M>>(
      `${context.servers.swapNode.btc_erc}/api/v1/${
        resource === 'pool' ? 'floats' : 'swaps'
      }/query?hash=${hash}`,
    );

    try {
      const result = await ethereumFetch;
      if (result.ok && result.response.items.length > 0) {
        return result.response.items[0];
      }
    } catch (e) {}

    try {
      const result = await binanceFetch;
      if (result.ok && result.response.items.length > 0) {
        return result.response.items[0];
      }
    } catch (e) {}

    throw new Error(`Could not find swap with hash "${hash}"`);
  })();

  if (resource === 'withdrawal' && result.currencyIn !== 'sbBTC') {
    throw new Error(`"${hash}" is not a withdrawal, it is a swap.`);
  }

  if (resource === 'swap' && result.currencyIn === 'sbBTC') {
    throw new Error(`"${hash}" is not a swap, it is a withdrawal.`);
  }

  return {
    addressUserOut: result.addressIn || null,
    addressUserIn: result.addressOut,
    addressSwapIn: result.addressDeposit,
    amountIn: result.amountIn,
    amountOut: result.amountOut,
    // Temporarily fixes API bug where it retuns `BTCE` instead of `WBTC`
    currencyIn: ((result.currencyIn as any) === 'BTCE' ? 'WBTC' : result.currencyIn) as any,
    currencyOut: ((result.currencyOut as any) === 'BTCE' ? 'WBTC' : result.currencyOut) as any,
    feeCurrency: ((result.feeCurrency as any) === 'BTCE' ? 'WBTC' : result.feeCurrency) as any,
    feeTotal: result.fee,
    hash: result.hash,
    status: result.status,
    transactionInId: result.txIdIn || null,
    transactionOutId: result.txIdOut || null,
    timestamp: new Date(result.timestamp * 1000),
  };
};
