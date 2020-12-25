import validate from 'bitcoin-address-validation';

import type { SkybridgeContext } from '../context';

export const isBitcoinAddress = ({
  context,
  address,
}: {
  context: Pick<SkybridgeContext, 'mode'>;
  address: string;
}): boolean => {
  const result = validate(address);
  if (!result) {
    return false;
  }

  if (result.network === 'testnet' && context.mode === 'test') {
    return true;
  }

  if (result.network === 'mainnet' && context.mode === 'production') {
    return true;
  }

  return false;
};
