import { Big } from 'big.js';

import { SkybridgeMode } from '../../modes';
import { CommonSwapParams } from '../../common-params';
import { calculateSwapFees } from '../calculateSwapFees';

export const estimateSwapAmountOut = async <M extends SkybridgeMode>({
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
  const fees = await calculateSwapFees({ context, currencyIn, currencyOut });
  const totalFee = new Big(amountUser).times(fees.feeBridgePercent).plus(fees.feeMiner);

  return {
    ...fees,
    feeTotal: totalFee.toFixed(),
    amountOut: new Big(amountUser).minus(totalFee).toFixed(),
  };
};
