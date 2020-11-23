import { fetch } from '../../fetch';
import { Mode } from '../../modes';
import { CommonSwapParams } from '../../swap-params';

export const getEthBlock = async <M extends Mode>(
  params: Pick<CommonSwapParams<M>, 'context'>,
): Promise<number> => {
  const result = await fetch<{ blockbook: { inSync: boolean; bestHeight: number } }>(
    `${params.context.servers.ethereum.explorer}/api/v2`,
  );

  if (result.ok && result.response.blockbook.inSync) {
    return result.response.blockbook.bestHeight;
  } else {
    throw Error('Failed to sync with BlockBook API');
  }
};
