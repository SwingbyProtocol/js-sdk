import { Bridge } from '../bridges';
import type { Mode } from '../modes';
import type { CommonAnyParams } from '../common-params';
import { getSwapBridgesFor } from '../coins';

export const getBridgeFor = <M extends Mode>({
  context,
  currencyIn,
  currencyOut,
}: Pick<CommonAnyParams<M>, 'context' | 'currencyIn' | 'currencyOut'>): Bridge => {
  if (currencyOut === 'sbBTC') {
    return 'btc_erc';
  }

  const inBridges = getSwapBridgesFor({ context, coin: currencyIn });
  const outBridges = getSwapBridgesFor({ context, coin: currencyOut });

  const result = inBridges.find((it) => outBridges.includes(it));
  if (result) {
    return result;
  }

  throw new Error(`Could not find ${context.mode} bridge for ${currencyIn}<>${currencyOut}`);
};
