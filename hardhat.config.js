require('@nomiclabs/hardhat-ethers');
require('hardhat-abi-exporter');
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-etherscan");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: "http://0.0.0.0:8545"
    },
    // rinkeby: {
    //   accounts: [``],
    // },
  },
  etherscan: {
    apiKey: "XHVB91EIPX3BP4SJ7K6XDBZ1C8IVYGB4VD"
  },
  solidity: "0.6.12",
  abiExporter: {
    path: './data/abi',
    clear: true,
    flat: true,
    spacing: 2
  }
};
