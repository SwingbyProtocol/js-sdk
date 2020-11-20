import { isEthereumCoin } from '../coins';
import type { Mode } from '../modes';
import type { Network } from '../networks';
import type { CommonSwapParams } from '../swap-params';

export const getNetwork = <M extends Mode>({
  currencyIn,
  currencyOut,
}: Pick<CommonSwapParams<M>, 'currencyIn' | 'currencyOut'>): Network => {
  if (isEthereumCoin(currencyIn) || isEthereumCoin(currencyOut)) {
    return 'ethereum';
  }

  return 'binance';
};
