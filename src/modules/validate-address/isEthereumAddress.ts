import { SwingbyContext } from '../context';

export const isEthereumAddress = ({
  address,
}: {
  context: SwingbyContext;
  address: string;
}): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
