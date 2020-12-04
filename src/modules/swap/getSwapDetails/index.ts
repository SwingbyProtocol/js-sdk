import { fetch } from '../../fetch';
import { Mode } from '../../modes';
import { CommonSwapParams, SwapStatus } from '../../swap-params';

type ServerReturnType<M extends Mode> = {
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

export const getSwapDetails = async <M extends Mode>({
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
    currencyIn: result.currencyIn,
    currencyOut: result.currencyOut,
    feeTotal: result.fee,
    feeCurrency: result.feeCurrency,
    hash: result.hash,
    status: result.status,
    transactionInId: result.txIdIn || null,
    transactionOutId: result.txIdOut || null,
    timestamp: new Date(result.timestamp * 1000),
  };
};
