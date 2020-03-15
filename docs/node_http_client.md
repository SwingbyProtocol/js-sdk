<a name="NodeHttpClient"></a>

## NodeHttpClient
**Kind**: global class  

* [NodeHttpClient](#NodeHttpClient)
    * [new NodeHttpClient(options)](#new_NodeHttpClient_new)
    * [.createFloat()](#NodeHttpClient+createFloat) ⇒ <code>object</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>intger</code>
    * [.queryFloats(args)](#NodeHttpClient+queryFloats)
    * [.getTssAddresses()](#NodeHttpClient+getTssAddresses) ⇒ <code>array</code> \| <code>string</code> \| <code>string</code>
    * [.getPeers(args)](#NodeHttpClient+getPeers) ⇒ <code>array</code>
    * [.getStakes()](#NodeHttpClient+getStakes) ⇒ <code>array</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>integer</code> \| <code>boolean</code>
    * [.getStatus()](#NodeHttpClient+getStatus) ⇒ <code>array</code> \| <code>object</code> \| <code>object</code>
    * [.calculateSwap(args)](#NodeHttpClient+calculateSwap) ⇒ <code>object</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>integer</code>
    * [.createSwap(args)](#NodeHttpClient+createSwap) ⇒ <code>object</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>integer</code>
    * [.swap(args)](#NodeHttpClient+swap) ⇒ <code>object</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>integer</code> \| <code>object</code>
    * [.getSwapFees()](#NodeHttpClient+getSwapFees) ⇒ <code>array</code> \| <code>string</code> \| <code>string</code> \| <code>string</code>
    * [.querySwaps(args)](#NodeHttpClient+querySwaps) ⇒ <code>object</code> \| <code>integer</code> \| <code>integer</code> \| <code>array</code>
    * [.getSwapStats()](#NodeHttpClient+getSwapStats) ⇒ <code>object</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>number</code> \| <code>number</code> \| <code>number</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>number</code> \| <code>number</code> \| <code>array</code> \| <code>array</code> \| <code>number</code>

<a name="new_NodeHttpClient_new"></a>

### new NodeHttpClient(options)
Initiate the Swingby http client


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.url | <code>string</code> | url path to swingby node |
| options.debug | <code>object</code> | debugger instace |
| options.getHandler | <code>function</code> | async GET request handling function |
| options.postHandler | <code>function</code> | async POST request handling function |
| options.logTransport | <code>boolean</code> | log GET and POST data |

<a name="NodeHttpClient+createFloat"></a>

### nodeHttpClient.createFloat() ⇒ <code>object</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>intger</code>
Create a float deposit record
https://testnet-node.swingby.network/docs#operation/createFloat

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>object</code> - flaot<code>string</code> - float.amount<code>string</code> - float.currency<code>string</code> - float.hash<code>intger</code> - float.nonce  
<a name="NodeHttpClient+queryFloats"></a>

### nodeHttpClient.queryFloats(args)
Query all float records
https://testnet-node.swingby.network/docs#operation/queryFloats

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> |  |
| args.hash | <code>string</code> | Hash of the inbound float |
| args.chain | <code>string</code> | Currency (BTC, BNB ...) |
| args.address | <code>string</code> | Swap inbound address |
| args.status | <code>string</code> | Status of swap (pending | active | expired) |
| args.page_size | <code>integer</code> | Max number of items per page |
| args.page | <code>integer</code> | Page number |
| args.sort | <code>integer</code> | if sort = 1 then results are old - new |
| args.OrInHash | <code>string</code> | Hash of the inbound transaction (OR match) |
| args.OrHash | <code>string</code> | Hash of the outbound transaction (OR match) |
| args.OrInAddress | <code>string</code> | Swap inbound address (OR match) |

<a name="NodeHttpClient+getTssAddresses"></a>

### nodeHttpClient.getTssAddresses() ⇒ <code>array</code> \| <code>string</code> \| <code>string</code>
Get the nodes TSS addresses
https://testnet-node.swingby.network/docs#operation/getAddresses

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>array</code> - addresses<code>string</code> - addresses[n].address<code>string</code> - addresses[n].currency  
<a name="NodeHttpClient+getPeers"></a>

### nodeHttpClient.getPeers(args) ⇒ <code>array</code>
Get a list of peers connected to the node
https://testnet-node.swingby.network/docs#operation/getPeers

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>array</code> - Node peers  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> |  |
| args.type | <code>string</code> | node type (signer | default: normal) |

<a name="NodeHttpClient+getStakes"></a>

### nodeHttpClient.getStakes() ⇒ <code>array</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>integer</code> \| <code>boolean</code>
Get all stakes on the network
https://testnet-node.swingby.network/docs#operation/getStakes

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>array</code> - stakes<code>string</code> - stakes.address<code>string</code> - stakes.amount<code>string</code> - stakes.stakeTxHash<code>integer</code> - stakes.stakeTime<code>boolean</code> - stakes.stakeValid  
<a name="NodeHttpClient+getStatus"></a>

### nodeHttpClient.getStatus() ⇒ <code>array</code> \| <code>object</code> \| <code>object</code>
Get node state and network metadata
https://testnet-node.swingby.network/docs#operation/getStatus

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>array</code> - NodeStatus<code>object</code> - NodeStatus.nodeInfo<code>object</code> - NodeStatus.swapInfo  
<a name="NodeHttpClient+calculateSwap"></a>

### nodeHttpClient.calculateSwap(args) ⇒ <code>object</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>integer</code>
Calculates the actual amount that the user will receive and fees for a given swap
https://testnet-node.swingby.network/docs#operation/calculateSwap

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>object</code> - swap<code>string</code> - swap.currency_from<code>string</code> - swap.currency_to<code>string</code> - swap.fee<code>string</code> - swap.receive_amount<code>string</code> - swap.send_amount<code>integer</code> - swap.nonce  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> |  |
| args.addressTo | <code>string</code> | Payout address |
| args.amount | <code>string</code> | Amount of funds to swap |
| args.currencyFrom | <code>string</code> | Currency from (BTC, BNB ...) |
| args.currencyTo | <code>string</code> | Currency to (BTC, BNB ...) |

<a name="NodeHttpClient+createSwap"></a>

### nodeHttpClient.createSwap(args) ⇒ <code>object</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>integer</code>
Creates a swap record
https://testnet-node.swingby.network/docs#operation/createSwap

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>object</code> - swap<code>string</code> - swap.addressIn<code>string</code> - swap.addressOut<code>string</code> - swap.amountIn<code>string</code> - swap.currencyIn<code>string</code> - swap.currencyOut<code>integer</code> - swap.timestamp  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> |  |
| args.addressTo | <code>string</code> | Payout address |
| args.amount | <code>string</code> | Amount of funds to swap |
| args.currencyFrom | <code>string</code> | Currency from (BTC, BNB ...) |
| args.currencyTo | <code>string</code> | Currency to (BTC, BNB ...) |
| args.nonce | <code>integer</code> | PoW nonce |

<a name="NodeHttpClient+swap"></a>

### nodeHttpClient.swap(args) ⇒ <code>object</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>integer</code> \| <code>object</code>
Calculates PoW and creates a swap record

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>object</code> - swap<code>string</code> - swap.addressIn<code>string</code> - swap.addressOut<code>string</code> - swap.amountIn<code>string</code> - swap.currencyIn<code>string</code> - swap.currencyOut<code>integer</code> - swap.timestamp<code>object</code> - swap.calc response from calculateSwap  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> |  |
| args.addressTo | <code>string</code> | Payout address |
| args.amount | <code>string</code> | Amount of funds to swap |
| args.currencyFrom | <code>string</code> | Currency from (BTC, BNB ...) |
| args.currencyTo | <code>string</code> | Currency to (BTC, BNB ...) |

<a name="NodeHttpClient+getSwapFees"></a>

### nodeHttpClient.getSwapFees() ⇒ <code>array</code> \| <code>string</code> \| <code>string</code> \| <code>string</code>
Get the fees for performing a swap
https://testnet-node.swingby.network/docs#operation/getSwapFees

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>array</code> - fees<code>string</code> - fees[n].bridgeFeePercent<code>string</code> - fees[n].currency<code>string</code> - fees[n].minerFee  
<a name="NodeHttpClient+querySwaps"></a>

### nodeHttpClient.querySwaps(args) ⇒ <code>object</code> \| <code>integer</code> \| <code>integer</code> \| <code>array</code>
https://testnet-node.swingby.network/docs#operation/queryTransactions

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>object</code> - swaps<code>integer</code> - swaps.itemCount number of swaps in response<code>integer</code> - swaps.total number of swaps in db<code>array</code> - swaps.items  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> |  |
| args.in_hash | <code>string</code> | Hash of the inbound tx |
| args.out_hash | <code>string</code> | Hash of the outbound tx |
| args.to_chain | <code>string</code> | Currency (BTC, BNB ...) |
| args.from_chain | <code>string</code> | Currency (BTC, BNB ...) |
| args.inAddress | <code>string</code> | Swap inbound address |
| args.outAddress | <code>string</code> | Swap outbound address |
| args.status | <code>string</code> | Status of swap (pending | active | expired) |
| args.page_size | <code>integer</code> | Max number of items per page |
| args.page | <code>integer</code> | Page number |
| args.sort | <code>integer</code> | if sort = 1 then results are old - new |
| args.orInHash | <code>string</code> | Hash of the inbound transaction (OR match) |
| args.orOutHash | <code>string</code> | Hash of the outbound transaction (OR match) |
| args.orHash | <code>string</code> | Hash of the outbound transaction (OR match) |
| args.orInAddress | <code>string</code> | Swap inbound address (OR match) |
| args.orOutAddress | <code>string</code> | Swap outbound address (OR match) |

<a name="NodeHttpClient+getSwapStats"></a>

### nodeHttpClient.getSwapStats() ⇒ <code>object</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>number</code> \| <code>number</code> \| <code>number</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>array</code> \| <code>number</code> \| <code>number</code> \| <code>array</code> \| <code>array</code> \| <code>number</code>
https://testnet-node.swingby.network/docs#operation/getSwapStats

**Kind**: instance method of [<code>NodeHttpClient</code>](#NodeHttpClient)  
**Returns**: <code>object</code> - stats<code>array</code> - stats.network1mSwaps<code>array</code> - stats.network1mSwapsVolume<code>array</code> - stats.network24hrSwaps<code>array</code> - stats.network24hrSwapsVolume<code>array</code> - stats.networkRewards1mVolume<code>array</code> - stats.networkRewards24hrVolume<code>number</code> - stats.networkRewardsVolume<code>number</code> - stats.networkSwaps<code>number</code> - stats.networkSwapsVolume<code>array</code> - stats.participated1mSwaps<code>array</code> - stats.participated1mSwapsVolume<code>array</code> - stats.participated24hrSwaps<code>array</code> - stats.participated24hrSwapsVolume<code>number</code> - stats.participatedSwaps<code>number</code> - stats.participatedSwapsVolume<code>array</code> - stats.rewards1mVolume<code>array</code> - stats.rewards24hrVolume<code>number</code> - stats.rewardsVolume  
