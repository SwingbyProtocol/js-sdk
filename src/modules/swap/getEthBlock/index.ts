import { fetch } from '../../fetch';

export const getEthBlock = async (): Promise<number> => {
  const result = await fetch<{ blockbook: { inSync: boolean; bestHeight: number } }>(
    'https://indexer-goerli.swingby.network/api/v2',
  );

  if (result.ok && result.response.blockbook.inSync) {
    return result.response.blockbook.bestHeight;
  } else {
    throw Error('Failed to sync with BlockBook API');
  }
};
