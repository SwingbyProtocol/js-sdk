import { Big } from 'big.js';

import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { calculateFees } from '../calculateFees';
import { SkybridgeResource } from '../../resources';

export const estimateAmountReceiving = async <M extends SkybridgeMode>({
  context,
  currencyDeposit,
  currencyReceiving,
  amountDesired,
}: Pick<
  SkybridgeParams<SkybridgeResource, M>,
  'context' | 'amountDesired' | 'currencyDeposit' | 'currencyReceiving'
>): Promise<
  Pick<
    SkybridgeParams<SkybridgeResource, M>,
    'feeBridgeFraction' | 'feeMiner' | 'feeCurrency' | 'amountReceiving' | 'feeTotal'
  >
> => {
  const fees = await calculateFees({ context, currencyDeposit, currencyReceiving });
  const totalFee = new Big(amountDesired).times(fees.feeBridgeFraction).plus(fees.feeMiner);

  return {
    ...fees,
    feeTotal: totalFee.toFixed(),
    amountReceiving: new Big(amountDesired).minus(totalFee).toFixed(),
  };
};
