import { decode, fromWords } from 'bech32';

import type { SkybridgeContext } from '../context';
import { logger } from '../logger';

export const isBinanceAddress = ({
  context,
  address,
}: {
  context: SkybridgeContext;
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
