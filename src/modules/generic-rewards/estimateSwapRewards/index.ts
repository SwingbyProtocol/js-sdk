import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import type { SkybridgeResource } from '../../resources';
import { fetch } from '../../fetch';

export const estimateSwapRewards = async <M extends SkybridgeMode>({
  context,
  currencyDeposit,
  currencyReceiving,
  amountDesired,
}: Pick<
  SkybridgeParams<SkybridgeResource, M>,
  'context' | 'amountDesired' | 'currencyDeposit' | 'currencyReceiving'
>): Promise<
  Pick<SkybridgeParams<SkybridgeResource, M>, 'price' | 'rebateRate' | 'amountReceiving'>
> => {
  const result = await fetch<{
    price: string;
    rebateRate: string;
    estimatedAmountReceiving: string;
  }>(
    `https://netword.skybridge.exchange/api/v3/${context.mode}/swap-rewards?currencyDeposit=${currencyDeposit}&currencyReceiving=${currencyReceiving}&amountDeposit=${amountDesired}`,
  );

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  return {
    price: result.response.price,
    rebateRate: result.response.rebateRate,
    amountReceiving: result.response.estimatedAmountReceiving,
  };
};
