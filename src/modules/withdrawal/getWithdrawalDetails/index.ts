import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { getSwapDetails } from '../../swap';

export const getWithdrawalDetails = async <M extends SkybridgeMode>({
  context,
  hash,
}: Pick<SkybridgeParams<'withdrawal', M>, 'context' | 'hash'>) => {
  const result = await getSwapDetails({ context, hash });
  if ((result.currencyIn as any) !== 'sbBTC') {
    throw new Error(`Hash "${hash}" belongs to a swap, not a withdrawal`);
  }

  return result;
};
