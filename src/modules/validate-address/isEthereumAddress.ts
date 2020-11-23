import { SwingbyContext } from '../context';
import { Mode } from '../modes';

export const isEthereumAddress = <M extends Mode>({
  address,
}: {
  context: SwingbyContext<M>;
  address: string;
}): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
