import { fetch } from '../../../fetch';
import { Mode } from '../../../modes';
import { Network } from '../../../networks';
import { CommonSwapParams } from '../../../swap-params';

export const getBlockHeight = async <M extends Mode>({
  context,
  network,
}: Pick<CommonSwapParams<M>, 'context'> & { network: Network }): Promise<number> => {
  const result = await fetch<{ blockbook: { inSync: boolean; bestHeight: number } }>(
    `${context.servers[network].explorer}/api/v2`,
  );

  if (result.ok && result.response.blockbook.inSync) {
    return result.response.blockbook.bestHeight;
  } else {
    throw Error('Failed to sync with BlockBook API');
  }
};
