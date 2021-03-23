import type { SkybridgeBridge } from '../bridges';
import { fetch } from '../fetch';
import { baseLogger } from '../logger';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeParams } from '../common-params';
import type { SkybridgeResource } from '../resources';

const logger = baseLogger.extend('block-height');

const TIMEOUT = 1 * 60 * 1000;
const INTERVAL = 2000;

export const getBlockHeight = async <M extends SkybridgeMode>({
  context,
  bridge,
}: Pick<SkybridgeParams<SkybridgeResource, M>, 'context'> & {
  bridge: SkybridgeBridge;
}): Promise<number> => {
  return getBlockHeightRec({ context, bridge, startedAt: Date.now() });
};

const getBlockHeightRec = async <M extends SkybridgeMode>({
  context,
  bridge,
  startedAt,
}: Pick<SkybridgeParams<SkybridgeResource, M>, 'context'> & {
  bridge: SkybridgeBridge;
  startedAt: number;
}): Promise<number> => {
  const result = await fetch<{ blockbook: { inSync: boolean; bestHeight: number } }>(
    `${context.servers.indexer[bridge]}/api/v2`,
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
      getBlockHeightRec({ context, bridge, startedAt }).then(resolve).catch(reject);
    }, INTERVAL),
  );
};
