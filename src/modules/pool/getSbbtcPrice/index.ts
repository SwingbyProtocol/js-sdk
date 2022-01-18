import type { SkybridgeMode } from '../../modes';
import type { SkybridgeParams } from '../../common-params';
import { fetcher } from '../../fetch';
import { SkybridgeBridge } from '../../bridges';

export const getSbbtcPrice = async <M extends SkybridgeMode>({
  context,
  bridge,
}: {
  context: Pick<SkybridgeParams<'withdrawal', M>['context'], 'mode'>;
  bridge: SkybridgeBridge;
}): Promise<string> => {
  const result = await fetcher<{
    price: string;
  }>(`https://widget.skybridge.exchange/api/${context.mode}/${bridge}/sbBTC/price`);

  return result.price;
};
