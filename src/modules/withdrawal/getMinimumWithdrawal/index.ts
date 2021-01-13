import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { fetch } from '../../fetch';
import { SkybridgeCoin } from '../../coins';

export const getMinimumWithdrawal = async <M extends SkybridgeMode>({
  context,
  currencyReceiving,
  amountDesired = '0',
}: Pick<SkybridgeParams<'withdrawal', M>, 'context' | 'currencyReceiving'> &
  Partial<Pick<SkybridgeParams<'withdrawal', M>, 'amountDesired'>>): Promise<{
  minimumWithdrawal: string;
  minimumWithdrawalCurrency: SkybridgeCoin<'withdrawal', M, 'out'>;
}> => {
  const result = await fetch<{
    minimumWithdrawalCurrency: SkybridgeCoin<'withdrawal', M, 'out'>;
    minimumWithdrawal: string;
  }>(
    `https://network.skybridge.exchange/api/v1/${context.mode}/sbBTC/withdrawal?currencyReceiving=${currencyReceiving}&amountDeposit=${amountDesired}`,
  );

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  return result.response;
};
