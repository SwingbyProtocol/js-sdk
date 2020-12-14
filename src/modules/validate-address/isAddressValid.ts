import type { SkybridgeContext } from '../context';
import type { SkybridgeChain } from '../chains';

import { isBinanceAddress } from './isBinanceAddress';
import { isBitcoinAddress } from './isBitcoinAddress';
import { isEthereumAddress } from './isEthereumAddress';

export const isAddressValid = ({
  context,
  address,
  chain,
}: {
  context: SkybridgeContext;
  address: string;
  /**
   * If passed, this function will verify whether the address is valid for this partifular chain.
   *
   * If not passed, this function will verify whether the address is valid for at least one of the supported chains. */
  chain?: SkybridgeChain;
}): boolean => {
  if (typeof chain === 'undefined') {
    return (
      isEthereumAddress({ context, address }) ||
      isBitcoinAddress({ context, address }) ||
      isBinanceAddress({ context, address })
    );
  }

  switch (chain) {
    case 'binance':
      return isBinanceAddress({ context, address });
    case 'bitcoin':
      return isBitcoinAddress({ context, address });
    case 'ethereum':
      return isEthereumAddress({ context, address });
    default:
      throw new Error(`Invalid chain "${chain}`);
  }
};
