import { Big } from 'big.js';

import { getBridgeFor } from '../../context';
import { fetch } from '../../fetch';
import { Mode } from '../../modes';
import { CommonSwapParams } from '../../common-params';
import { Coin } from '../../coins';

export const calculateFees = async <M extends Mode>({
  context,
  currencyIn,
  currencyOut,
}: Pick<CommonSwapParams<M>, 'context' | 'currencyIn' | 'currencyOut'>): Promise<
  Pick<CommonSwapParams<M>, 'feeBridgePercent' | 'feeMiner' | 'feeCurrency'>
> => {
  const bridge = getBridgeFor({ context, currencyIn, currencyOut });
  const result = await fetch<
    Array<{ bridgeFeePercent: string; currency: Coin<M>; minerFee: string }>
  >(`${context.servers.swapNode[bridge]}/api/v1/swaps/fees`);

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  const fees = result.response.find((it) => it.currency === currencyOut);
  if (!fees) {
    throw new Error(`500: Could not find fee info for "${currencyOut}"`);
  }

  return {
    feeBridgePercent: new Big(fees.bridgeFeePercent).div('100').toFixed(),
    feeMiner: new Big(fees.minerFee).div('1e8').toFixed(),
    feeCurrency: currencyOut,
  };
};
