export const isTaprootAddress = (address: string): boolean => {
  // taproot addresses are Bitcoin addresses that start with 'bc1p' for mainnet and 'tb1p' for testnet
  return address.startsWith('bc1p') || address.startsWith('tb1p');
};
