import { fetch } from '../../fetch';
import { Mode } from '../../modes';
import { CommonSwapParams } from '../../swap-params';

type StatusFromServer =
  | 'WAITING'
  | 'PENDING'
  | 'SIGNING'
  | 'SENDING'
  | 'COMPLETED'
  | 'SIGNING_REFUND'
  | 'SENDING_REFUND'
  | 'REFUNDED';

type ServerReturnType<M extends Mode> = {
  items: Array<
    Pick<
      CommonSwapParams<M>,
      'amountIn' | 'amountOut' | 'currencyIn' | 'currencyOut' | 'feeCurrency' | 'hash'
    > & {
      addressDeposit: string;
      fee: string;
      status: StatusFromServer;
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
      `${context.servers.btc_bep.swap}/api/v1/swaps/query?hash=${hash}`,
    );
    const binanceFetch = fetch<ServerReturnType<M>>(
      `${context.servers.btc_erc.swap}/api/v1/swaps/query?hash=${hash}`,
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
    status: getStatus(result.status),
    transactionInId: result.txIdIn || null,
    transactionOutId: result.txIdOut || null,
    timestamp: new Date(result.timestamp * 1000),
  };
};

const getStatus = (value: StatusFromServer): CommonSwapParams<'test'>['status'] => {
  switch (value) {
    case 'COMPLETED':
      return 'completed';
    case 'PENDING':
      return 'pending';
    case 'REFUNDED':
      return 'refunded';
    case 'SENDING':
      return 'sending';
    case 'SENDING_REFUND':
      return 'sending-refund';
    case 'SIGNING':
      return 'signing';
    case 'SIGNING_REFUND':
      return 'signing-refund';
    case 'WAITING':
      return 'waiting';
  }
};
