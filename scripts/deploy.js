async function main() {
  // We get the contract to deploy
  const PerpetualProtocolReferrer = await ethers.getContractFactory("PerpetualProtocolReferrer");
  console.log("Deploying PerpeturalProtocolReferrer...");
  const referrer = await PerpetualProtocolReferrer.deploy();
  await referrer.deployed();
  console.log("Referrer deployed to:", referrer.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });