const sdk = require('../')

const client = new sdk.NodeHttpClient({ url: 'https://testnet-node.swingby.network' })

const query = {
  inAddress: 'tbnb1z20t7rn6urh46m2tavny3ap9n0pvkf47mynuza',
  status: 'COMPLETED'
}
client.querySwaps(query)
  .then((swaps) => {
    console.log('returned swaps: \n')
    swaps.items.forEach(element => {
      console.log(element)
    })
    console.log()
  })
  .catch(console.error)
