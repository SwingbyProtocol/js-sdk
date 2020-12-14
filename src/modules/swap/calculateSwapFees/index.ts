import { Big } from 'big.js';

import { getBridgeFor } from '../../context';
import { fetch } from '../../fetch';
import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import type { SkybridgeCoin } from '../../coins';

export const calculateSwapFees = async <M extends SkybridgeMode>({
  context,
  currencyIn,
  currencyOut,
}: Pick<SkybridgeParams<'swap', M>, 'context' | 'currencyIn' | 'currencyOut'>): Promise<
  Pick<SkybridgeParams<'swap', M>, 'feeBridgePercent' | 'feeMiner' | 'feeCurrency'>
> => {
  const bridge = getBridgeFor({ context, currencyIn, currencyOut });
  const result = await fetch<
    Array<{ bridgeFeePercent: string; currency: SkybridgeCoin<'swap', M>; minerFee: string }>
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
