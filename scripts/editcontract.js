const ethers = require('ethers');
const abi = require('../data/abi/PerpetualProtocolReferrer.json')
const { PRIVATE_KEY } = require('./PK');

async function main() {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.xdaichain.com/')
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract('0xcf76A8365A218D799f36030d89f86C8FBCC65a6E', abi, wallet);

    const tx = await contract['_importPartner']('0x59737202A321Aa374D54a487997Fad625C2c9DC9', 'TEST1234', [])
    await tx.wait(2);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });