import { Chain, getChainFor } from '../chains';
import type { Coin } from '../coins';
import type { Mode } from '../modes';
import type { CommonSwapParams } from '../common-params';

const explorers: { [k in Chain]: { [k in Mode]: string } } = {
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
  coin,
}: Pick<CommonSwapParams<M>, 'context'> & {
  transactionId: string;
  coin: Coin;
}) => {
  const chain = getChainFor({ coin });
  const url = explorers[chain][context.mode];
  return url.replace(':transactionId', transactionId);
};
