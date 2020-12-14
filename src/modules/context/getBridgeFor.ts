import type { SkybridgeBridge } from '../bridges';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeParams } from '../common-params';
import type { SkybridgeAction } from '../actions';
import { getBridgesForCoin } from '../coins';

export const getBridgeFor = <M extends SkybridgeMode>({
  context,
  currencyIn,
  currencyOut,
}: Pick<
  SkybridgeParams<SkybridgeAction, M>,
  'context' | 'currencyIn' | 'currencyOut'
>): SkybridgeBridge => {
  const inBridges = getBridgesForCoin({ context, coin: currencyIn });
  const outBridges = getBridgesForCoin({ context, coin: currencyOut });

  const result = inBridges.find((it) => outBridges.includes(it));
  if (result) {
    return result;
  }

  throw new Error(`Could not find ${context.mode} bridge for ${currencyIn}<>${currencyOut}`);
};
