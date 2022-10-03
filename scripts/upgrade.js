const { ethers, upgrades } = require('hardhat');

async function main() {
  // We get the contract to deploy
  const PerpReferralV2 = await ethers.getContractFactory("PerpetualProtocolReferrer");
  const referralV2 = await upgrades.upgradeProxy('0xcf76A8365A218D799f36030d89f86C8FBCC65a6E', PerpReferralV2);
  console.log('Upgraded')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });