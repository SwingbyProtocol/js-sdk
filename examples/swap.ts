import { buildContext, createSwap, estimateSwapAmountOut } from '@swingby-protocol/sdk';

const addressUserIn = 'tbnb16ke3clwqmduvzv6awlprjw3ecw7g52qw7c6hdm';
const amountUser = '1';
const currencyIn = 'BTC';
const currencyOut = 'BTCB';

(async () => {
  const context = await buildContext({ mode: 'test' });

  const { feeTotal, feeBridgePercent, feeMiner, feeCurrency } = await estimateSwapAmountOut({
    context,
    amountUser,
    currencyIn,
    currencyOut,
  });

  console.log(
    `Transacion fee: ${feeTotal} ${feeCurrency} (${
      +feeBridgePercent * 100
    }% + ${feeMiner} ${feeCurrency})`,
  );

  const swap = await createSwap({
    context,
    amountUser,
    addressUserIn,
    currencyIn,
    currencyOut,
  });

  console.log(`Send ${swap.amountIn} (${swap.currencyIn}) to ${swap.addressSwapIn}`);
})();
