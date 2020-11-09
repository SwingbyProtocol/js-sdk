# Swingby SDK for NodeJS & JavaScript

An implementation of the Swingby standard development kit for NodeJS and JavaScript.

## Getting started

```bash
yarn add @swingby-protocol/sdk
```

```tsx
import { calculateSwap, createSwap } from '@swingby-protocol/sdk';

const addressTo = 'tbnb16ke3clwqmduvzv6awlprjw3ecw7g52qw7c6hdm';
const currencyFrom = 'BTC';
const currencyTo = 'BTC.B';

const { nonce, amount } = await calculateSwap({
  amount: '1',
  addressTo,
  currencyFrom,
  currencyTo,
});

const swap = createSwap({
  amount,
  nonce,
  network: 'test',
  addressTo,
  currencyFrom,
  currencyTo,
});

console.log('Swap record:\n');
console.log(`Send ${swap.amountIn} (${swap.currencyIn}) to ${swap.addressIn}`);
console.log(`Receive ${swap.calc.receive_amount} (${swap.currencyOut}) to ${swap.addressOut}`);
```
