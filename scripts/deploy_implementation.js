const { ethers, upgrades } = require('hardhat');

async function main() {
  // We get the contract to deploy
  const PerpReferralV2 = await ethers.getContractFactory("PerpetualProtocolReferrer");
  const PerpReferralV2Instance = await PerpReferralV2.deploy();
  console.log("ReferrerV2 deployed to:", PerpReferralV2Instance.address);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });