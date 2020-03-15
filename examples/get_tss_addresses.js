const sdk = require('../')

const client = new sdk.NodeHttpClient({ url: 'https://testnet-node.swingby.network' })

client.getTssAddresses()
  .then((addresses) => {
    console.log('Current node TSS addresses: \n')
    addresses.forEach((addr) => {
      console.log(` - ${addr.currency}: ${addr.address}`)
    })
    console.log()
  })
  .catch(console.error)
