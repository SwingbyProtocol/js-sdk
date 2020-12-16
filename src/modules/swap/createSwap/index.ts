import type { SkybridgeMode } from '../../modes';
import { create, CreateParams, CreateResult } from '../../generic-create';

export const createSwap = async <M extends SkybridgeMode>(
  params: Omit<CreateParams<'swap', M>, 'resource'>,
): Promise<CreateResult<'swap', M>> => create({ ...params, resource: 'swap' });
