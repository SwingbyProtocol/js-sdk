import { SwingbyContext } from '..';

export const buildContext = (): SwingbyContext<'test'> => {
  return {
    mode: 'test',
    servers: {
      ethereum: { swap: '', explorer: 'https://indexer-goerli.swingby.network/api/v2' },
      binance: { swap: 'https://testnet-node.swingby.network', explorer: '' },
    },
  };
};
