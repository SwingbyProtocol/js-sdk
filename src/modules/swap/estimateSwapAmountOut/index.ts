import { Big } from 'big.js';

import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { calculateSwapFees } from '../calculateSwapFees';

export const estimateSwapAmountOut = async <M extends SkybridgeMode>({
  context,
  currencyIn,
  currencyOut,
  amountUser,
}: Pick<
  SkybridgeParams<'swap', M>,
  'context' | 'amountUser' | 'currencyIn' | 'currencyOut'
>): Promise<
  Pick<
    SkybridgeParams<'swap', M>,
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
