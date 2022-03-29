import type { PartialDeep } from 'type-fest';

import { SkybridgeBridge, SKYBRIDGE_BRIDGES } from '../bridges';
import { SkybridgePeer } from '../common-params';
import { FIXED_NODE_ENDPOINT } from '../endpoints';
import { fetcher } from '../fetch';
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

  const getRandomIndexer = async ({ bridge }: { bridge: SkybridgeBridge }) => {
    const index = SKYBRIDGE_BRIDGES.findIndex((it) => it === bridge);

    if (results[index].indexerNodes.length <= 1) {
      return results[index].indexerNodes[0] ?? null;
    }

    for (const indexer of results[index].indexerNodes) {
      try {
        const result = await fetcher<{ blockbook: { inSync: boolean } }>(`${indexer}/api/v2`);
        if (result.blockbook.inSync) {
          return indexer;
        }
      } catch (e) {}
    }

    return null;
  };

  const getRandomSwapNode = async ({
    bridge,
    mode,
  }: {
    bridge: SkybridgeBridge;
    mode: SkybridgeMode;
  }) => {
    const fallbackEndpoint = FIXED_NODE_ENDPOINT[bridge][mode][0];

    // Memo: Currently Ropsten endpoint is available for node-1 only
    if (mode === 'test') {
      const nodes = FIXED_NODE_ENDPOINT[bridge][mode];
      const node = nodes[randomInt(0, nodes.length - 1)];
      return node;
    }
    const index = SKYBRIDGE_BRIDGES.findIndex((it) => it === bridge);
    try {
      const swapNodes = (() => {
        const sorted = [...results[index].swapNodes].filter((it) => {
          try {
            return (
              typeof it.restUri === 'string' &&
              new URL(it.restUri).protocol === 'https:' &&
              it.restUri !== 'https://'
            );
          } catch (e) {
            return false;
          }
        });

        return sorted;
      })();
      const endpoint = (swapNodes[randomInt(0, swapNodes.length - 1)] || null)?.restUri;

      try {
        const url = `${endpoint}/api/v1/peers`;
        const result = await fetcher<SkybridgePeer[]>(url);
        if (result.length > 0) {
          return endpoint;
        } else {
          return fallbackEndpoint;
        }
      } catch (error) {
        return fallbackEndpoint;
      }
    } catch (e) {
      return fallbackEndpoint;
    }
  };

  return {
    mode,
    affiliateApi: affiliateApi ?? 'https://affiliate.swingby.network',
    servers: {
      swapNode: {
        btc_erc:
          servers?.swapNode?.btc_erc ?? (await getRandomSwapNode({ bridge: 'btc_erc', mode })),
        btc_skypool:
          servers?.swapNode?.btc_skypool ??
          (await getRandomSwapNode({ bridge: 'btc_skypool', mode })),
      },
      indexer: {
        btc_erc: servers?.indexer?.btc_erc ?? (await getRandomIndexer({ bridge: 'btc_erc' })),
        btc_skypool:
          servers?.indexer?.btc_skypool ?? (await getRandomIndexer({ bridge: 'btc_skypool' })),
      },
    },
  };
};
