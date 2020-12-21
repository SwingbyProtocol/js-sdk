import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { getDetails } from '../../generic-details';

export const getSwapDetails = async <M extends SkybridgeMode>(
  params: Pick<SkybridgeParams<'swap', M>, 'context' | 'hash'>,
) => getDetails({ ...params, resource: 'swap' });
