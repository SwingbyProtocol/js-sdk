const sdk = require('../')

const client = new sdk.NodeHttpClient({ url: 'https://testnet-node.swingby.network' })

const newSwap = {
  addressTo: 'tbnb1dedxffvl324ggfdpxl0gw5hwylc848ztuy7g7c',
  amount: '1.1',
  currencyFrom: 'BTC',
  currencyTo: 'BTC.B'
}

client.swap(newSwap)
  .then((swap) => {
    console.log('Swap record:\n')
    console.log(`Send ${swap.amountIn} (${swap.currencyIn}) to ${swap.addressIn}`)
    console.log(`Receive ${swap.calc.receive_amount} (${swap.currencyOut}) to ${swap.addressOut}`)
    console.log()
  })
  .catch(console.error)
