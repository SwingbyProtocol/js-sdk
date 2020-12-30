import { Big } from 'big.js';

import { getBridgeFor } from '../../context';
import { fetch } from '../../fetch';
import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import type { SkybridgeCoin } from '../../coins';
import { SkybridgeResource } from '../../resources';

export const calculateFees = async <M extends SkybridgeMode>({
  context,
  currencyDeposit,
  currencyReceiving,
}: Pick<
  SkybridgeParams<SkybridgeResource, M>,
  'context' | 'currencyDeposit' | 'currencyReceiving'
>): Promise<
  Pick<SkybridgeParams<SkybridgeResource, M>, 'feeBridgeFraction' | 'feeMiner' | 'feeCurrency'>
> => {
  const bridge = getBridgeFor({ context, currencyDeposit, currencyReceiving });
  const result = await fetch<
    Array<{
      bridgeFeePercent: string;
      currency: SkybridgeCoin<SkybridgeResource, M>;
      minerFee: string;
    }>
  >(`${context.servers.swapNode[bridge]}/api/v1/swaps/fees`);

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  const fees = result.response.find((it) => it.currency === currencyReceiving);
  if (!fees) {
    throw new Error(`500: Could not find fee info for "${currencyReceiving}"`);
  }

  return {
    feeBridgeFraction: new Big(fees.bridgeFeePercent).div('100').toFixed(),
    feeMiner: new Big(fees.minerFee).div('1e8').toFixed(),
    feeCurrency: currencyReceiving,
  };
};
