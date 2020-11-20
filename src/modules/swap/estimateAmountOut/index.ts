import { Big } from 'big.js';

import { Mode } from '../../modes';
import { CommonSwapParams } from '../../swap-params';
import { calculateFees } from '../calculateFees';

export const estimateAmountOut = async <M extends Mode>({
  context,
  currencyIn,
  currencyOut,
  amountUser,
}: Pick<CommonSwapParams<M>, 'context' | 'amountUser' | 'currencyIn' | 'currencyOut'>): Promise<
  Pick<
    CommonSwapParams<M>,
    'feeBridgePercent' | 'feeMiner' | 'feeCurrency' | 'amountOut' | 'feeTotal'
  >
> => {
  const fees = await calculateFees({ context, currencyIn, currencyOut });
  const totalFee = new Big(amountUser).times(fees.feeBridgePercent).plus(fees.feeMiner);

  return {
    ...fees,
    feeTotal: totalFee.toFixed(),
    amountOut: new Big(amountUser).minus(totalFee).toFixed(),
  };
};
