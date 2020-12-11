import { fetch } from '../../fetch';
import { Mode } from '../../modes';
import { CommonFloatParams, SwapStatus } from '../../common-params';

type ServerReturnType<M extends Mode> = {
  items: Array<
    Pick<
      CommonFloatParams<M>,
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

export const getFloatDetails = async <M extends Mode>({
  context,
  hash,
}: Pick<CommonFloatParams<M>, 'context' | 'hash'>): Promise<
  Pick<
    CommonFloatParams<M>,
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
    addressUserOut: CommonFloatParams<M>['addressUserOut'] | null;
    transactionInId: CommonFloatParams<M>['transactionInId'] | null;
    transactionOutId: CommonFloatParams<M>['transactionOutId'] | null;
  }
> => {
  const result = await (async () => {
    const ethereumFetch = fetch<ServerReturnType<M>>(
      `${context.servers.swapNode.btc_bep}/api/v1/floats/query?hash=${hash}`,
    );

    try {
      const result = await ethereumFetch;
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
