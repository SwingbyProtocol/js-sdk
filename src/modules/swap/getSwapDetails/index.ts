import { fetch } from '../../fetch';
import { SkybridgeMode } from '../../modes';
import { CommonSwapParams, SwapStatus } from '../../common-params';

type ServerReturnType<M extends SkybridgeMode> = {
  items: Array<
    Pick<
      CommonSwapParams<M>,
      'amountIn' | 'amountOut' | 'currencyIn' | 'currencyOut' | 'feeCurrency' | 'hash'
    > & {
      addressDeposit: string;
      fee: string;
      status: SwapStatus;
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
}: Pick<CommonSwapParams<M>, 'context' | 'hash'>): Promise<
  Pick<
    CommonSwapParams<M>,
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
    addressUserOut: CommonSwapParams<M>['addressUserOut'] | null;
    transactionInId: CommonSwapParams<M>['transactionInId'] | null;
    transactionOutId: CommonSwapParams<M>['transactionOutId'] | null;
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
