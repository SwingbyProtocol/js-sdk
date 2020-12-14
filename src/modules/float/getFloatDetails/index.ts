import { fetch } from '../../fetch';
import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams, SkydrigeStatus } from '../../common-params';

type ServerReturnType<M extends SkybridgeMode> = {
  items: Array<
    Pick<
      SkybridgeParams<'float', M>,
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

export const getFloatDetails = async <M extends SkybridgeMode>({
  context,
  hash,
}: Pick<SkybridgeParams<'float', M>, 'context' | 'hash'>): Promise<
  Pick<
    SkybridgeParams<'float', M>,
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
    addressUserOut: SkybridgeParams<'float', M>['addressUserOut'] | null;
    transactionInId: SkybridgeParams<'float', M>['transactionInId'] | null;
    transactionOutId: SkybridgeParams<'float', M>['transactionOutId'] | null;
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
