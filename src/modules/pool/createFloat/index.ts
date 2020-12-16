import type { SkybridgeMode } from '../../modes';
import { create, CreateParams, CreateResult } from '../../generic-create';

export const createFloat = async <M extends SkybridgeMode>(
  params: Omit<CreateParams<'pool', M>, 'resource' | 'currencyOut'>,
): Promise<CreateResult<'pool', M>> =>
  create({ ...params, resource: 'pool', currencyOut: 'sbBTC' });
