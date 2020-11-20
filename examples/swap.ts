import { buildContext, calculateSwap, createSwap, estimateAmountOut } from '@swingby-protocol/sdk';

const addressOut = 'tbnb16ke3clwqmduvzv6awlprjw3ecw7g52qw7c6hdm';
const amountUser = '1';
const currencyIn = 'BTC';
const currencyOut = 'BTCB';

(async () => {
  const context = await buildContext({ mode: 'test' });

  const { totalFee, bridgeFeePercent, minerFee } = await estimateAmountOut({
    context,
    amountUser,
    currencyIn,
    currencyOut,
  });

  console.log(
    `Transacion fee: ${totalFee} ${currencyOut} (${
      +bridgeFeePercent * 100
    }% + ${minerFee} ${currencyOut})`,
  );

  const { nonce, amountIn } = await calculateSwap({
    context,
    amountUser,
    addressOut,
    currencyIn,
    currencyOut,
  });

  const swap = await createSwap({
    context,
    amountIn,
    nonce,
    addressOut,
    currencyIn,
    currencyOut,
  });

  console.log(`Send ${swap.amountIn} (${swap.currencyIn}) to ${swap.addressIn}`);
})();