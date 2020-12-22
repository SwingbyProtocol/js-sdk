import { Big } from 'big.js';

import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { calculateSwapFees } from '../calculateSwapFees';

export const estimateSwapAmountReceiving = async <M extends SkybridgeMode>({
  context,
  currencyDeposit,
  currencyOut,
  amountDesired,
}: Pick<
  SkybridgeParams<'swap', M>,
  'context' | 'amountDesired' | 'currencyDeposit' | 'currencyOut'
>): Promise<
  Pick<
    SkybridgeParams<'swap', M>,
    'feeBridgePercent' | 'feeMiner' | 'feeCurrency' | 'amountReceiving' | 'feeTotal'
  >
> => {
  const fees = await calculateSwapFees({ context, currencyDeposit: currencyDeposit, currencyOut });
  const totalFee = new Big(amountDesired).times(fees.feeBridgePercent).plus(fees.feeMiner);

  return {
    ...fees,
    feeTotal: totalFee.toFixed(),
    amountReceiving: new Big(amountDesired).minus(totalFee).toFixed(),
  };
};
