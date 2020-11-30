import { Coin, getNetworkForCoin } from '../coins';
import { Mode } from '../modes';
import { CommonSwapParams } from '../swap-params';

const explorers = {
  ethereum: {
    test: 'https://goerli.etherscan.io/tx/:transactionId',
    production: 'https://etherscan.io/tx/:transactionId',
  },
  bitcoin: {
    test: 'https://www.blockchain.com/btc-testnet/tx/:transactionId',
    production: 'https://www.blockchain.com/btc/tx/:transactionId',
  },
  binance: {
    test: 'https://testnet-explorer.binance.org/tx/:transactionId',
    production: 'https://explorer.binance.org/tx/:transactionId',
  },
};

export const buildExplorerLink = <M extends Mode>({
  context,
  transactionId,
  currency,
}: Pick<CommonSwapParams<M>, 'context'> & {
  transactionId: string;
  currency: Coin;
}) => {
  const network = getNetworkForCoin(currency);
  const url = explorers[network][context.mode];
  return url.replace(':transactionId', transactionId);
};
