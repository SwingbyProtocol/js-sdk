import { validate, Network } from 'bitcoin-address-validation';

import type { SkybridgeContext } from '../context';

export const isBitcoinAddress = ({
  context,
  address,
}: {
  context: Pick<SkybridgeContext, 'mode'>;
  address: string;
}): boolean => {
  return validate(address, context.mode === 'test' ? Network.testnet : Network.mainnet);
};
