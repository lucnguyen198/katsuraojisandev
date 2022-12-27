require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
let secrets = require("./secrets.json");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.7"
    // settings: {
    //   optimizer: {
    //     enabled: true,
    //     runs: 200
    //   }
    // }
  },
  paths: {
    artifacts: "./src/artifacts"
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: secrets.url,
      accounts: [secrets.key],
      gasPrice: 40000000000
    }
    // polygon: {
    //   url: secrets.url,
    //   accounts: [secrets.key],
    //   gasPrice: 35000000000
    // }
  },
  etherscan: {
    apiKey: "RMTH5JJWARMRSZKQ81FD93B5P43KY426WA"
  },
  gasReporter: {
    gasPrice: 40,
    enabled: true
  }
};
