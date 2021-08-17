const { ethers } = require("hardhat");

async function main() {
    const accounts = await ethers.provider.listAccounts();
    const [owner, referrer, referee, referee2, referrer2] = await ethers.getSigners();

    const contractAddress = '0xA202F19C8Ae405Ff0e795C9F8DBb7987ea475E75';
    const PerpetualProtocolReferrer = await ethers.getContractFactory("PerpetualProtocolReferrer");
    const referrerContract = await PerpetualProtocolReferrer.attach(contractAddress);

    // create referral code for referrer 1
    await referrerContract.createReferralCode(accounts[1], 'ABC123');

    // create referral code for referrer 2 
    await referrerContract.createReferralCode(accounts[4], 'QWE123');

    // attach referee 1 to referrer 1
    await referrerContract.connect(referee).setReferralCode('ABC123');

    // attach referee 2 to referrer 2
    await referrerContract.connect(referee2).setReferralCode('QWE123');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });