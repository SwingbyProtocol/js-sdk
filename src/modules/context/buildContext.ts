import { DateTime } from 'luxon';
import type { PartialDeep } from 'type-fest';

import { SkybridgeBridge, SKYBRIDGE_BRIDGES } from '../bridges';
import type { SkybridgeMode } from '../modes';

import { getNetworkDetails } from './getNetworkDetails';
import type { SkybridgeContext } from './SkybridgeContext';

const randomInt = (min: number, max: number) => Math.round(Math.random() * (max - min)) + min;

export const buildContext = async <M extends SkybridgeMode>({
  mode,
  servers,
  affiliateApi,
}: {
  mode: M;
} & PartialDeep<Omit<SkybridgeContext<M>, 'mode'>>): Promise<SkybridgeContext<M>> => {
  const results = await Promise.all(
    SKYBRIDGE_BRIDGES.map((bridge) => getNetworkDetails({ mode, bridge })),
  );

  const getIndexer = ({ bridge }: { bridge: SkybridgeBridge }) => {
    const index = SKYBRIDGE_BRIDGES.findIndex((it) => it === bridge);
    return results[index].indexerNode ?? null;
  };

  const getRandomSwapNode = ({ bridge }: { bridge: SkybridgeBridge }) => {
    const index = SKYBRIDGE_BRIDGES.findIndex((it) => it === bridge);
    try {
      const swapNodes = (() => {
        const sorted = [...results[index].swapNodes]
          .filter((it) => {
            try {
              return (
                it.status !== 'unreachable' &&
                typeof it.restUri === 'string' &&
                new URL(it.restUri).protocol === 'https:'
              );
            } catch (e) {
              return false;
            }
          })
          .filter((it) => {
            try {
              return typeof it.restUri === 'string' && new URL(it.restUri).protocol === 'https:';
            } catch (e) {
              return false;
            }
          })
          .sort(
            (a, b) =>
              DateTime.fromJSDate(b.lastSeenAt).toMillis() -
              DateTime.fromJSDate(a.lastSeenAt).toMillis(),
          );

        if (sorted.length <= 1) return sorted;
        const latestDate = DateTime.fromJSDate(sorted[0].lastSeenAt);

        return sorted.filter(
          (it) => latestDate.diff(DateTime.fromJSDate(it.lastSeenAt)).as('minutes') < 15,
        );
      })();

      return (swapNodes[randomInt(0, swapNodes.length - 1)] || null)?.restUri;
    } catch (e) {
      return null;
    }
  };

  return {
    mode,
    affiliateApi: affiliateApi ?? 'https://affiliate.swingby.network',
    servers: {
      swapNode: {
        btc_erc: servers?.swapNode?.btc_erc ?? getRandomSwapNode({ bridge: 'btc_erc' }),
        btc_bep20: servers?.swapNode?.btc_bep20 ?? getRandomSwapNode({ bridge: 'btc_bep20' }),
      },
      indexer: {
        btc_erc: servers?.indexer?.btc_erc ?? getIndexer({ bridge: 'btc_erc' }),
        btc_bep20: servers?.indexer?.btc_bep20 ?? getIndexer({ bridge: 'btc_bep20' }),
      },
    },
  };
};
