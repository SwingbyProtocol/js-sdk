import BigNumber from 'bignumber.js';
import { getNetwork } from '../../context';
import { fetch } from '../../fetch';
import { Mode } from '../../modes';
import { CommonSwapParams } from '../../swap-params';
import { Coin } from '../../coins';

export const calculateFees = async <M extends Mode>({
  context,
  currencyIn,
  currencyOut,
}: Pick<CommonSwapParams<M>, 'context' | 'currencyIn' | 'currencyOut'>): Promise<{
  bridgeFeePercent: string;
  minerFeeInt: string;
  minerFee: string;
  minerFeeCurrency: 'BTC' | 'BNB' | 'ETH';
}> => {
  const network = getNetwork({ currencyIn, currencyOut });
  const result = await fetch<
    Array<{ bridgeFeePercent: string; currency: Coin<M>; minerFee: string }>
  >(`${context.servers[network].swap}/api/v1/swaps/fees`);

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  const fees = result.response.find((it) => it.currency === currencyOut);
  if (!fees) {
    throw new Error(`500: Could not find fee info for "${currencyOut}"`);
  }

  const minerFeeCurrency = (() => {
    if (currencyOut === 'BTC') {
      return 'BTC';
    }

    if (currencyOut === 'BTCB-1DE') {
      return 'BNB';
    }

    return 'ETH';
  })();

  return {
    bridgeFeePercent: fees.bridgeFeePercent,
    minerFeeInt: fees.minerFee,
    minerFee: (() => {
      if (minerFeeCurrency === 'BTC' || minerFeeCurrency === 'BNB') {
        return new BigNumber(fees.minerFee).div('1e8').toFixed();
      }

      return new BigNumber(fees.minerFee).div('1e18').toFixed();
    })(),
    minerFeeCurrency,
  };
};
