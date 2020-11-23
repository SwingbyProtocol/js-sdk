import validate from 'bitcoin-address-validation';

import { SwingbyContext } from '../context';
import { Mode } from '../modes';

export const isBitcoinAddress = <M extends Mode>({
  context,
  address,
}: {
  context: SwingbyContext<M>;
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
