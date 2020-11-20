import BigNumber from 'bignumber.js';
import { Mode } from '../../modes';
import { CommonSwapParams } from '../../swap-params';
import { calculateFees } from '../calculateFees';

export const estimateAmountOut = async <M extends Mode>({
  context,
  currencyIn,
  currencyOut,
  amountUser,
}: Pick<CommonSwapParams<M>, 'context' | 'amountUser' | 'currencyIn' | 'currencyOut'>): Promise<{
  bridgeFeePercent: string;
  minerFeeInt: string;
  minerFee: string;
  minerFeeCurrency: typeof currencyOut;
  amountOut: string;
  totalFee: string;
}> => {
  const fees = await calculateFees({ context, currencyIn, currencyOut });
  const totalFee = new BigNumber(amountUser).times(fees.bridgeFeePercent).plus(fees.minerFee);

  return {
    ...fees,
    totalFee: totalFee.toFixed(),
    amountOut: new BigNumber(amountUser).minus(totalFee).toFixed(),
  };
};
