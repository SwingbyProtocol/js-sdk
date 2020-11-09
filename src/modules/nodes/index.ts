type Network = 'test' | 'main';

type HasNetwork = { network: Network };
type HasCustomNode = { node: string };

export type WithServer = HasNetwork | HasCustomNode;

const hasCustomNode = (value: any): value is HasCustomNode => {
  return typeof value?.node === 'string';
};

const hasNetwork = (value: any): value is HasNetwork => {
  return typeof value?.network === 'string';
};

export const getNodeUrl = <P extends WithServer>(params: P): string => {
  if (hasCustomNode(params)) {
    return params.node;
  }

  if (hasNetwork(params)) {
    return 'https://testnet-node.swingby.network';
  }

  throw new Error('Either `network` or `node` must be provided');
};
