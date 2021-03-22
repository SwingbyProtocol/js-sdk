import { SkybridgeBridge } from '../bridges';

export const getPowEpoch = ({
  bridge,
  blockHeight,
}: {
  bridge: SkybridgeBridge;
  blockHeight: number;
}): number => {
  const round: number = (() => {
    if (bridge === 'btc_erc') {
      return Math.floor(blockHeight / 3);
    }

    if (bridge === 'btc_bep20') {
      return Math.floor(blockHeight / 15);
    }

    return blockHeight;
  })();

  return round + 1;
};
