import { getNetworkForCoin } from '../../coins';
import { fetch } from '../../fetch';
import { Mode } from '../../modes';
import { CommonSwapParams } from '../../swap-params';

import { getTransactionInHash } from './getTransactionInHash';

type StatusFromServer =
  | 'WAITING'
  | 'PENDING'
  | 'SIGNING'
  | 'SENDING'
  | 'COMPLETED'
  | 'SIGNING_REFUND'
  | 'SENDING_REFUND'
  | 'REFUNDED';

const STATUSES = [
  'waiting',
  'pending',
  'signing',
  'sending',
  'completed',
  'signing-refund',
  'sending-refund',
  'refunded',
] as const;
type Status = typeof STATUSES[number];

export const findSwap = async <M extends Mode>({
  context,
  addressIn,
  amountIn,
  currencyIn,
}: Pick<CommonSwapParams<M>, 'context' | 'amountIn' | 'addressIn' | 'currencyIn'>): Promise<{
  transacionInHash: string | null;
  transactionOutHash: string | null;
  status: Status;
}> => {
  const network = getNetworkForCoin(currencyIn);
  const transactionInHash = await (async () => {
    try {
      return await getTransactionInHash({ context, addressIn, amountIn, currencyIn });
    } catch (e) {
      return null;
    }
  })();

  if (!transactionInHash) {
    return { transacionInHash: null, transactionOutHash: null, status: 'waiting' };
  }

  const result = await fetch<{
    items: Array<{ txIdIn: string; txIdOut: string; status: StatusFromServer }>;
  }>(`${context.servers[network].swap}/api/v1/swaps/query?in_hash=${transactionInHash}`);

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  if (result.response.items.length <= 0) {
    return { transacionInHash: null, transactionOutHash: null, status: 'waiting' };
  }

  return {
    transacionInHash: result.response.items[0].txIdIn,
    transactionOutHash: result.response.items[0].txIdOut,
    status: getStatus(result.response.items[0].status),
  };
};

const getStatus = (value: StatusFromServer): Status => {
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
