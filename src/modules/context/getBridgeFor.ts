import { Bridge } from '../bridges';
import type { Mode } from '../modes';
import type { CommonSwapParams } from '../swap-params';
import { getBridgesFor } from '../coins';

export const getBridgeFor = <M extends Mode>({
  context,
  currencyIn,
  currencyOut,
}: Pick<CommonSwapParams<M>, 'context' | 'currencyIn' | 'currencyOut'>): Bridge => {
  const inBridges = getBridgesFor({ context, coin: currencyIn });
  const outBridges = getBridgesFor({ context, coin: currencyOut });

  const result = inBridges.find((it) => outBridges.includes(it));
  if (result) {
    return result;
  }

  throw new Error(`Could not find ${context.mode} bridge for ${currencyIn}<>${currencyOut}`);
};
