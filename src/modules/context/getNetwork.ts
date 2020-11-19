import { logger } from '../logger';
import type { Mode } from '../modes';
import type { Network } from '../networks';
import type { CommonSwapParams } from '../swap-params';

export const getNetwork = <M extends Mode>({
  currencyIn,
  currencyOut,
}: Pick<CommonSwapParams<M>, 'currencyIn' | 'currencyOut'>): Network => {
  logger('getNetwork() for %s->%s', currencyIn, currencyOut);
  return 'binance';
};
