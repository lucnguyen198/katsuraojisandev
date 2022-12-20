// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const basePath = process.cwd();
let contractAddresses = require("../src/ContractAddresses.json");
const fs = require("fs");
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Account address:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  console.log(
    "block number:",
    (await ethers.provider.getBlockNumber()).toString()
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
