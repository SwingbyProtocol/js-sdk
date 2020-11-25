import { fetch } from '../../../../fetch';
import { logger } from '../../../../logger';
import { Mode } from '../../../../modes';
import { Network } from '../../../../networks';
import { CommonSwapParams } from '../../../../swap-params';

const TIMEOUT = 1 * 60 * 1000;
const INTERVAL = 2000;

export const getBlockHeight = async <M extends Mode>({
  context,
  network,
}: Pick<CommonSwapParams<M>, 'context'> & { network: Network }): Promise<number> => {
  return getBlockHeightRec({ context, network, startedAt: Date.now() });
};

const getBlockHeightRec = async <M extends Mode>({
  context,
  network,
  startedAt,
}: Pick<CommonSwapParams<M>, 'context'> & { network: Network; startedAt: number }): Promise<
  number
> => {
  const result = await fetch<{ blockbook: { inSync: boolean; bestHeight: number } }>(
    `${context.servers[network].explorer}/api/v2`,
  );

  if (result.ok && result.response.blockbook.inSync) {
    const value = result.response.blockbook.bestHeight;
    logger('getBlockHeight() succeeded and will return "%d".', value);
    return value;
  }

  if (Date.now() - startedAt > TIMEOUT) {
    logger('getBlockHeight() has been failing for more than %dms. Will throw error.', TIMEOUT);
    throw new Error('Failed to sync with BlockBook API');
  }

  logger('getBlockHeight() has failed. Will try again in %dms.', INTERVAL);
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      getBlockHeightRec({ context, network, startedAt }).then(resolve).catch(reject);
    }, INTERVAL),
  );
};
