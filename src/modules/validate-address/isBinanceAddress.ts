import { decode, fromWords } from 'bech32';

import { SwingbyContext } from '../context';
import { logger } from '../logger';
import { Mode } from '../modes';

export const isBinanceAddress = <M extends Mode>({
  context,
  address,
}: {
  context: SwingbyContext<M>;
  address: string;
}): boolean => {
  const prefix = context.mode === 'production' ? 'bnb' : 'tbnb';

  try {
    if (!address.startsWith(prefix)) {
      return false;
    }

    const decodedAddress = decode(address);
    const decodedAddressLength = Buffer.from(fromWords(decodedAddress.words)).length;

    return decodedAddressLength === 20 && decodedAddress.prefix === prefix;
  } catch (e) {
    logger('isBinanceAddress() failed: %s', e.message);
    return false;
  }
};
