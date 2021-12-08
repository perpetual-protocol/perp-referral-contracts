const { ethers, upgrades } = require('hardhat');

async function main() {
  // We get the contract to deploy
  const PerpReferralV2 = await ethers.getContractFactory("PerpetualProtocolReferrer");
  const referralV2 = await upgrades.deployProxy(PerpReferralV2, [], { initializer: 'init' });
  await referralV2.deployed();
  console.log("ReferrerV2 deployed to:", referralV2.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });