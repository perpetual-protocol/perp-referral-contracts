require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');
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
    xdai: {
      url: 'https://rpc.xdaichain.com/',
    },
    kovan: {
      url: 'https://kovan.optimism.io',
    },
    optimism: {
      url: 'https://mainnet.optimism.io',
      accounts: [process.env.PK]
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  solidity: "0.7.6",
  abiExporter: {
    path: './data/abi',
    clear: true,
    flat: true,
    spacing: 2
  }
};
