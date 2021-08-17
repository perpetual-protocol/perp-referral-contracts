const { ethers } = require("hardhat");

async function main() {
    const accounts = await ethers.provider.listAccounts();
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const contractAddress = '0x41626Deb73B2E436eADac6848C78694c1Bc26403';

    const PerpetualProtocolReferrer = await ethers.getContractFactory("PerpetualProtocolReferrer");
    const referrer = await PerpetualProtocolReferrer.attach(contractAddress);

    // await referrer.connect(owner).createReferralCode('0x7845EE7dbd6361689baFc6eBD287a7EE2A8A7436', 'BINGPOTT');
    // await referrer.connect(owner).createReferralCode('0x512472840327530eA03cCE6F58966B221f3a8b6a', 'ABD123');
    // const code = await referrer.getReferralCodeByReferrerAddress(accounts[4]);
    // console.log('code', code);

    await referrer.connect(addr2).setReferralCode('ABD123');
    // await referrer.connect(addr3).setReferralCode('');
    // const referralCode = await referrer.connect(addr2).getMyRefereeCode();
    // console.log('code', referralCode);
  
    // console.log('code', code.toString());
    // await referrer.setOwner(accounts[1]);
    // await referrer.connect(addr1).updateOwner();
  // const candidate = await referrer.getOwnerCandidate();
  // console.log('candidate', candidate);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });