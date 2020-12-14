import { Chain, getChainFor } from '../chains';
import type { SkybridgeCoin } from '../coins';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeParams } from '../common-params';
import { SkybridgeAction } from '../actions';

const explorers: { [k in Chain]: { [k in SkybridgeMode]: string } } = {
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

export const buildExplorerLink = <M extends SkybridgeMode>({
  context,
  transactionId,
  coin,
}: Pick<SkybridgeParams<SkybridgeAction, M>, 'context'> & {
  transactionId: string;
  coin: SkybridgeCoin;
}) => {
  const chain = getChainFor({ coin });
  const url = explorers[chain][context.mode];
  return url.replace(':transactionId', transactionId);
};
