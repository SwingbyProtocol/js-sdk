import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { fetcher } from '../../fetch';
import { SkybridgeBridge } from '../../bridges';

export const getSbbtcPrice = async <M extends SkybridgeMode>({
  context,
  bridge,
}: Pick<SkybridgeParams<'withdrawal', M>, 'context'> & {
  bridge: SkybridgeBridge;
}): Promise<string> => {
  const result = await fetcher<{
    price: string;
  }>(`https://network.skybridge.exchange/api/v2/${context.mode}/${bridge}/sbBTC/price`);

  return result.price;
};
