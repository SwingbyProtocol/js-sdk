import type { SkybridgeBridge } from '../bridges';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeParams } from '../common-params';
import type { SkybridgeResource } from '../resources';
import { getBridgesForCoin } from '../coins';

export const getBridgeFor = <M extends SkybridgeMode>({
  context,
  currencyDeposit,
  currencyOut,
}: Pick<
  SkybridgeParams<SkybridgeResource, M>,
  'context' | 'currencyDeposit' | 'currencyOut'
>): SkybridgeBridge => {
  const inBridges = getBridgesForCoin({ context, coin: currencyDeposit });
  const outBridges = getBridgesForCoin({ context, coin: currencyOut });

  const result = inBridges.find((it) => outBridges.includes(it));
  if (result) {
    return result;
  }

  throw new Error(`Could not find ${context.mode} bridge for ${currencyDeposit}<>${currencyOut}`);
};
