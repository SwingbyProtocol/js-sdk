import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { fetch } from '../../fetch';

export const getSbbtcPrice = async <M extends SkybridgeMode>({
  context,
}: Pick<SkybridgeParams<'withdrawal', M>, 'context'>): Promise<string> => {
  const result = await fetch<{
    price: string;
  }>(`https://network.skybridge.exchange/api/v1/${context.mode}/sbBTC/price`);

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  return result.response.price;
};
