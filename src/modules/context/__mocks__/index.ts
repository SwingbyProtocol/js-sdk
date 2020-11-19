import { ServersConfig } from '..';

export const buildContext = (): ServersConfig<'test'> => {
  return {
    mode: 'test',
    ethereum: { swap: '', explorer: 'https://indexer-goerli.swingby.network/api/v2' },
    binance: { swap: 'https://testnet-node.swingby.network', explorer: '' },
  };
};
