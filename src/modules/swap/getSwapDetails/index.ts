import { fetch } from '../../fetch';
import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams, SkydrigeStatus } from '../../common-params';

type ServerReturnType<M extends SkybridgeMode> = {
  items: Array<
    Pick<
      SkybridgeParams<'swap', M>,
      'amountIn' | 'amountOut' | 'currencyIn' | 'currencyOut' | 'feeCurrency' | 'hash'
    > & {
      addressDeposit: string;
      fee: string;
      status: SkydrigeStatus;
      txIdIn: string;
      txIdOut: string;
      timestamp: number;
      addressIn?: string;
      addressOut: string;
    }
  >;
};

export const getSwapDetails = async <M extends SkybridgeMode>({
  context,
  hash,
}: Pick<SkybridgeParams<'swap', M>, 'context' | 'hash'>): Promise<
  Pick<
    SkybridgeParams<'swap', M>,
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
    addressUserOut: SkybridgeParams<'swap', M>['addressUserOut'] | null;
    transactionInId: SkybridgeParams<'swap', M>['transactionInId'] | null;
    transactionOutId: SkybridgeParams<'swap', M>['transactionOutId'] | null;
  }
> => {
  const result = await (async () => {
    const ethereumFetch = fetch<ServerReturnType<M>>(
      `${context.servers.swapNode.btc_bep}/api/v1/swaps/query?hash=${hash}`,
    );
    const binanceFetch = fetch<ServerReturnType<M>>(
      `${context.servers.swapNode.btc_erc}/api/v1/swaps/query?hash=${hash}`,
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

  return {
    addressUserOut: result.addressIn || null,
    addressUserIn: result.addressOut,
    addressSwapIn: result.addressDeposit,
    amountIn: result.amountIn,
    amountOut: result.amountOut,
    // Temporarily fixes API bug where it retuns `BTCE` instead of `WBTC`
    currencyIn: (result.currencyIn as any) === 'BTCE' ? 'WBTC' : result.currencyIn,
    currencyOut: (result.currencyOut as any) === 'BTCE' ? 'WBTC' : result.currencyOut,
    feeCurrency: (result.feeCurrency as any) === 'BTCE' ? 'WBTC' : result.feeCurrency,
    feeTotal: result.fee,
    hash: result.hash,
    status: result.status,
    transactionInId: result.txIdIn || null,
    transactionOutId: result.txIdOut || null,
    timestamp: new Date(result.timestamp * 1000),
  };
};
