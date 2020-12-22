import type { SkybridgeMode } from '../../modes';
import { create, CreateParams, CreateResult } from '../../generic-create';

export const createWithdrawal = async <M extends SkybridgeMode>(
  params: Omit<CreateParams<'withdrawal', M>, 'resource' | 'currencyDeposit'>,
): Promise<CreateResult<'withdrawal', M>> =>
  create({ ...params, resource: 'withdrawal', currencyDeposit: 'sbBTC' });
