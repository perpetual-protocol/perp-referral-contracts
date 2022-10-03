
const ethers = require('ethers');
const abi = require('../data/abi/PerpetualProtocolReferrer.json');
async function main() {
    const contractAddress = '0xcf76A8365A218D799f36030d89f86C8FBCC65a6E';

    const provider = new ethers.providers.JsonRpcProvider('https://rpc.xdaichain.com/')
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // run this after creating a partner normally
    // const code = await contract.getReferralCodeByPartnerAddress('ENTER ADDRESS');
    // console.log('code', code);

    // // run this after importing a partner with some fake addresses as referrers
    // const importedCode = await contract._importPartner('0xa67790bbb0cABea05BDa45bdafE392edEd046832', 'TEST1', []);
    // const importedTrader = await contract.traders('0x7845EE7dbd6361689baFc6eBD287a7EE2A8A7436');
    const importedPartner = await contract.partners('0xb00F278820859B7865CEE00AEB19B8a2AD97C7B1');
    // console.log('imported code', importedCode);
    // console.log('imported trader', importedTrader);
    console.log('imported partner', importedPartner);

    // // run this after creating/removing/updating an uncapped partner
    // const tier = await contract.uncappedPartners("0x512472840327530ea03cce6f58966b221f3a8b6a");
    // console.log('tier', tier);

    // console.log('tier', tier);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });