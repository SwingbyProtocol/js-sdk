import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { getDetails } from '../../generic-details';

export const getWithdrawalDetails = async <M extends SkybridgeMode>(
  params: Pick<SkybridgeParams<'withdrawal', M>, 'context' | 'hash'>,
) => getDetails({ ...params, resource: 'withdrawal' });
