import type { SkybridgeContext } from '../context';

export const isEthereumAddress = ({
  address,
}: {
  context: Pick<SkybridgeContext, 'mode'>;
  address: string;
}): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
