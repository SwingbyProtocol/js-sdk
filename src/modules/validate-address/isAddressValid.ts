import type { SwingbyContext } from '../context';
import type { Network } from '../networks';

import { isBinanceAddress } from './isBinanceAddress';
import { isBitcoinAddress } from './isBitcoinAddress';
import { isEthereumAddress } from './isEthereumAddress';

export const isAddressValid = ({
  context,
  address,
  network,
}: {
  context: SwingbyContext;
  address: string;
  network?: Network;
}): boolean => {
  if (typeof network === 'undefined') {
    return (
      isEthereumAddress({ context, address }) ||
      isBitcoinAddress({ context, address }) ||
      isBinanceAddress({ context, address })
    );
  }

  switch (network) {
    case 'binance':
      return isBinanceAddress({ context, address });
    case 'bitcoin':
      return isBitcoinAddress({ context, address });
    case 'ethereum':
      return isEthereumAddress({ context, address });
    default:
      throw new Error(`Invalid network "${network}`);
  }
};
