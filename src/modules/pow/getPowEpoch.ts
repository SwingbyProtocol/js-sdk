import { SkybridgeBridge } from '../bridges';

export const getPowEpoch = ({
  bridge,
  blockHeight,
}: {
  bridge: SkybridgeBridge;
  blockHeight: number;
}): number => {
  const round: number = (() => {
    if (bridge === 'btc_erc' || bridge === 'btc_skypool') {
      return Math.floor(blockHeight / 3);
    }

    return blockHeight;
  })();

  return round + 1;
};
