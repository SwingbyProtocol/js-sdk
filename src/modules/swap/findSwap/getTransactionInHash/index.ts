import { Big } from 'big.js';

import { getNetworkForCoin } from '../../../coins';
import { fetch } from '../../../fetch';
import { Mode } from '../../../modes';
import { Network } from '../../../networks';
import { CommonSwapParams } from '../../../swap-params';

export const getTransactionInHash = async <M extends Mode>({
  context,
  currencyIn,
  addressIn,
  amountIn,
}: Pick<CommonSwapParams<M>, 'context' | 'currencyIn' | 'addressIn' | 'amountIn'>): Promise<
  string
> => {
  const network = getNetworkForCoin(currencyIn);
  const result = await fetch<{ txids: string[] }>(
    `${context.servers[network].explorer}/api/v2/address/${addressIn}`,
  );

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  const candidates = result.response.txids.slice(0, 5);
  for (let i = 0; i < candidates.length; i++) {
    const transactionId = candidates[i];
    if (await doesTxMatch({ context, network, amountIn, addressIn, transactionId })) {
      return transactionId;
    }
  }

  throw new Error(
    `Could not find a recent transaction with amountIn=${amountIn}, addressIn=${addressIn} and currencyIn=${currencyIn}`,
  );
};

const doesTxMatch = async <M extends Mode>({
  context,
  network,
  transactionId,
  amountIn,
  addressIn,
}: Pick<CommonSwapParams<M>, 'context' | 'amountIn' | 'addressIn'> & {
  network: Network;
  transactionId: string;
}): Promise<boolean> => {
  const result = await fetch<{
    tokenTransfers: Array<{ value: string; from: string }>;
    vout: Array<{ value: string }>;
  }>(`${context.servers[network].explorer}/api/v2/tx/${transactionId}`);

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  if (network === 'ethereum') {
    return !!result.response.tokenTransfers.find((it) => {
      try {
        return new Big(it.value).div('1e8').eq(amountIn) && it.from === addressIn;
      } catch (e) {
        return false;
      }
    });
  }

  return !!result.response.vout.find((it) => {
    try {
      return new Big(it.value).div('1e8').eq(amountIn);
    } catch (e) {
      return false;
    }
  });
};
