import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { SkybridgeResource } from '../../resources';
import { fetch } from '../../fetch';
import { SkybridgeCoin } from '../../coins';

export const estimateAmountReceiving = async <M extends SkybridgeMode>({
  context,
  currencyDeposit,
  currencyReceiving,
  amountDesired,
}: Pick<
  SkybridgeParams<SkybridgeResource, M>,
  'context' | 'amountDesired' | 'currencyDeposit' | 'currencyReceiving'
>): Promise<
  Pick<
    SkybridgeParams<SkybridgeResource, M>,
    'feeBridgeFraction' | 'feeMiner' | 'feeCurrency' | 'amountReceiving' | 'feeTotal'
  >
> => {
  const result = await fetch<{
    feeBridgeFraction: string;
    feeCurrency: SkybridgeCoin<SkybridgeResource, M>;
    feeMiner: string;
    feeTotal: string;
    estimatedAmountReceiving: string;
  }>(
    `https://network.skybridge.exchange/api/v1/${context.mode}/fees?currencyDeposit=${currencyDeposit}&currencyReceiving=${currencyReceiving}&amountDeposit=${amountDesired}`,
  );

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  return {
    feeBridgeFraction: result.response.feeBridgeFraction,
    feeCurrency: result.response.feeCurrency,
    feeMiner: result.response.feeMiner,
    feeTotal: result.response.feeTotal,
    amountReceiving: result.response.estimatedAmountReceiving,
  };
};
