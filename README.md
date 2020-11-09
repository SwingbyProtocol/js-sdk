# Swingby SDK for NodeJS & JavaScript

An implementation of the Swingby standard development kit for NodeJS and JavaScript.

## Features:

- Official implementation
- Http Client
- Tustless swaps between ECDSA chains

## Instillation

```bash
npm install -g swingby-js-sdk
```

## Quickstart

Initiate a http connection to one of our testnet nodes:

```js
const sdk = require('swingby-js-sdk');
const client = new sdk.NodeHttpClient({ url: 'https://testnet-node.swingby.network' });
```

Create a trustless swap deposit:

```js
const newSwap = {
  addressTo: 'tbnb1dedxffvl324ggfdpxl0gw5hwylc848ztuy7g7c',
  amount: '1.1',
  currencyFrom: 'BTC',
  currencyTo: 'BTC.B',
};
client.swap(newSwap).then(console.log);
```

Query the last 5 completed swaps:

```js
const query = {
  page_size: 5,
  status: 'COMPLETED',
};
client.querySwaps(query).then(console.log);
```

for more examples on how to retrieve data from a node and interact with the Swingby network, please
head to the [examples `examples/`](/examples) folder.

## Docs

For in depth documentation on our js SDK, please
[see `docs/node_http_client.md`](/docs/node_http_client.md). For documentation on our node API,
please visit [estnet-node.swingby.network/docs](https://testnet-node.swingby.network/).

## Useful links

- [Website](https://swingby.network)
- [Swingby explorer](https://bridge-testnet.swingby.network/explorer)
- [Swingby network dashboard](https://testnet-node.swingby.network/)
