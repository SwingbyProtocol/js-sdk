const sdk = require('../')

const client = new sdk.NodeHttpClient({ url: "https://testnet-node.swingby.network" })

async function start() {
    const fees = await client.getSwapFees()
    console.log('Swap network fees:')
    fees.forEach((fee) => {
        console.log(`- ${fee.currency} - bridgeFee = ${fee.bridgeFeePercent}, minerFee = ${fee.minerFee}`)
    })
    console.log()

    const status = await client.getStatus()
    console.log(`Node status:`)
    console.log('Moniker:', status.nodeInfo.moniker, `(${status.nodeInfo.version})`)
    console.log('Addr: ', status.nodeInfo.listenAddr)
    console.log('CollateralStaked:', status.swapInfo.stakeAmount)
    console.log()
}
start()