import { SkybridgeChain, getChainFor } from '../chains';
import type { SkybridgeCoin } from '../coins';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeParams } from '../common-params';
import type { SkybridgeResource } from '../resources';

const explorers: { [k in SkybridgeChain]: { [k in SkybridgeMode]: string } } = {
  ethereum: {
    test: 'https://goerli.etherscan.io/tx/:transactionId',
    production: 'https://etherscan.io/tx/:transactionId',
  },
  bitcoin: {
    test: 'https://www.blockchain.com/btc-testnet/tx/:transactionId',
    production: 'https://www.blockchain.com/btc/tx/:transactionId',
  },
  'binance-smart': {
    test: 'https://testnet.bscscan.com/tx/:transactionId',
    production: 'https://bscscan.com/tx/:transactionId',
  },
};

export const buildExplorerLink = <M extends SkybridgeMode>({
  context,
  transactionId,
  coin,
}: Pick<SkybridgeParams<SkybridgeResource, M>, 'context'> & {
  transactionId: string;
  coin: SkybridgeCoin;
}) => {
  const chain = getChainFor({ coin });
  const url = explorers[chain][context.mode];
  return url.replace(':transactionId', transactionId);
};
