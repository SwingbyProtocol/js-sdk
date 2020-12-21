import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { getDetails } from '../../generic-details';

export const getFloatDetails = async <M extends SkybridgeMode>(
  params: Pick<SkybridgeParams<'pool', M>, 'context' | 'hash'>,
) => getDetails({ ...params, resource: 'pool' });
