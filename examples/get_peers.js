const sdk = require('../');

const client = new sdk.NodeHttpClient({ url: 'https://testnet-node.swingby.network' });

client
  .getPeers()
  .then((peers) => {
    console.log('Current node peers: \n');
    peers.forEach((peer) => {
      console.log(` - ${peer.moniker}: ${peer.id} (${peer.version})`);
    });
    console.log();
  })
  .catch(console.error);
