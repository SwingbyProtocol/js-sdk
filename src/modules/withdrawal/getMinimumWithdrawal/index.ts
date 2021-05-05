import type { SkybridgeMode } from '../../modes';
import type { SkybridgeBridge } from '../../bridges';
import type { SkybridgeParams } from '../../common-params';
import { fetcher } from '../../fetch';
import { SkybridgeCoin } from '../../coins';

export const getMinimumWithdrawal = async <M extends SkybridgeMode>({
  context,
  bridge,
  currencyReceiving,
  amountDesired = '0',
}: { bridge: SkybridgeBridge } & Pick<
  SkybridgeParams<'withdrawal', M>,
  'context' | 'currencyReceiving'
> &
  Partial<Pick<SkybridgeParams<'withdrawal', M>, 'amountDesired'>>): Promise<{
  minimumWithdrawal: string;
  minimumWithdrawalCurrency: SkybridgeCoin<'withdrawal', M, 'out'>;
}> => {
  return await fetcher<{
    minimumWithdrawalCurrency: SkybridgeCoin<'withdrawal', M, 'out'>;
    minimumWithdrawal: string;
  }>(
    `https://network.skybridge.exchange/api/v3/${context.mode}/${bridge}/sbBTC/withdrawal-info?currencyReceiving=${currencyReceiving}&amountDeposit=${amountDesired}`,
  );
};
