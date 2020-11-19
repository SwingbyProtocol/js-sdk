# Swingby SDK for NodeJS & JavaScript

An implementation of the Swingby standard development kit for NodeJS and JavaScript.

## Getting started

```bash
yarn add @swingby-protocol/sdk
```

```tsx
import { buildContext, calculateSwap, createSwap } from '@swingby-protocol/sdk';

const addressOut = 'tbnb16ke3clwqmduvzv6awlprjw3ecw7g52qw7c6hdm';
const currencyIn = 'BTC';
const currencyOut = 'BTC.B';

const context = await buildContext({ mode: 'test' });

const { nonce, amountIn } = await calculateSwap({
  context,
  amountIn: '1',
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

console.log('Swap record:\n');
console.log(`Send ${swap.amountIn} (${swap.currencyIn}) to ${swap.addressIn}`);
```
