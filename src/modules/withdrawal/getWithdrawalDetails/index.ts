import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { getSwapDetails } from '../../swap';

export const getWithdrawalDetails = async <M extends SkybridgeMode>({
  context,
  hash,
}: Pick<SkybridgeParams<'swap', M>, 'context' | 'hash'>) => getSwapDetails({ context, hash });
