import { buildContext, createSwap, estimateAmountReceiving } from '@swingby-protocol/sdk';

const addressReceiving = '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc';
const amountDesired = '1';
const currencyDeposit = 'BTC';
const currencyReceiving = 'WBTC';

(async () => {
  const context = await buildContext({ mode: 'test' });

  const { feeTotal, feeBridgePercent, feeMiner, feeCurrency } = await estimateAmountReceiving({
    context,
    amountDesired,
    currencyDeposit,
    currencyReceiving,
  });

  console.log(
    `Transacion fee: ${feeTotal} ${feeCurrency} (${
      +feeBridgePercent * 100
    }% + ${feeMiner} ${feeCurrency})`,
  );

  const swap = await createSwap({
    context,
    amountDesired,
    addressReceiving,
    currencyDeposit,
    currencyReceiving,
  });

  console.log(`Send ${swap.amountDeposit} (${swap.currencyDeposit}) to ${swap.addressDeposit}`);
})();
