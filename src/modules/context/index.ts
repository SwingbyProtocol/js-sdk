import { logger } from '../logger';
import { Mode } from '../modes';
import { Network } from '../networks';
import { CommonSwapParams } from '../swap-params';

export type SwingbyContext<M extends Mode> = {
  readonly mode: M;
  servers: {
    readonly [N in Network]: {
      swap: string;
      explorer: string;
    };
  };
};

export const getNetwork = <M extends Mode>({
  currencyIn,
  currencyOut,
}: Pick<CommonSwapParams<M>, 'currencyIn' | 'currencyOut'>): Network => {
  logger('getNetwork() for %s->%s', currencyIn, currencyOut);
  return 'binance';
};

export const buildContext = async <M extends Mode>({
  mode,
}: {
  mode: M;
}): Promise<SwingbyContext<M>> => {
  return {
    mode,
    servers: { ethereum: { swap: '', explorer: '' }, binance: { swap: '', explorer: '' } },
  };
};
