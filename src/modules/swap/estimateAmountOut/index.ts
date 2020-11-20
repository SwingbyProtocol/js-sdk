import BigNumber from 'bignumber.js';
import { Mode } from '../../modes';
import { CommonSwapParams } from '../../swap-params';
import { calculateFees } from '../calculateFees';

export const estimateAmountOut = async <M extends Mode>({
  context,
  currencyIn,
  currencyOut,
  amountIn,
}: Pick<CommonSwapParams<M>, 'context' | 'amountIn' | 'currencyIn' | 'currencyOut'>): Promise<{
  bridgeFeePercent: string;
  minerFeeInt: string;
  minerFee: string;
  minerFeeCurrency: typeof currencyOut;
  amountOut: string;
}> => {
  const fees = await calculateFees({ context, currencyIn, currencyOut });

  return {
    ...fees,
    amountOut: new BigNumber(amountIn)
      .times(new BigNumber(1).minus(fees.bridgeFeePercent))
      .minus(fees.minerFee)
      .toFixed(),
  };
};
