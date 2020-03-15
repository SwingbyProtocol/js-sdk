# Swingby SDK for NodeJS & JavaScript

An implementation of the Swingby standard development kit for NodeJS and JavaScript.

## Features:

* Official implementation
* Http Client
* Tustless swaps between ECDSA chains

## Instillation

```bash
npm install -g swingby-js-sdk
```

## Quickstart

Initiate a http connection to one of our testnet nodes:

```js
const sdk = require('swingby-js-sdk')
const client = new sdk.NodeHttpClient({ url: "https://testnet-node.swingby.network" })
```

Create a trustless swap deposit:

```js
const newSwap = {
    addressTo: "tbnb1dedxffvl324ggfdpxl0gw5hwylc848ztuy7g7c",
    amount: "1.1",
    currencyFrom: "BTC",
    currencyTo: "BTC.B"
}
client.swap(newSwap)
```

## Docs

[See `docs/node_http_client.md`](/docs/node_http_client.md)

