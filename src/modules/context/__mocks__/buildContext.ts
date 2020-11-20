import { SwingbyContext } from '..';

export const buildContext = (): SwingbyContext<'test'> => {
  return {
    mode: 'test',
    servers: {
      ethereum: {
        swap: 'https://tbtc-goerli-1.swingby.network',
        explorer: 'https://indexer-goerli.swingby.network/api/v2',
      },
      binance: {
        swap: 'https://testnet-node.swingby.network',
        explorer: '',
      },
    },
  };
};
