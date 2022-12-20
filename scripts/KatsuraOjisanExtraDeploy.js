// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
require("dotenv").config();
const hre = require("hardhat");
const basePath = process.cwd();
let contractAddresses = require("../src/ContractAddresses.json");
const fs = require("fs");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  console.log(
    "block number:",
    (await ethers.provider.getBlockNumber()).toString()
  );

  const conditionFactory = await hre.ethers.getContractFactory(
    "KatsuraOjisanExtraCondition"
  );

  console.log("Deploying KatsuraOjisanExtraCondition contract");
  const conditionContract = await conditionFactory.deploy();
  await conditionContract.deployed();
  console.log(
    "KatsuraOjisanExtraCondition deployed to:",
    conditionContract.address
  );

  // We get the contract to deploy
  const extraFactory = await hre.ethers.getContractFactory(
    "KatsuraOjisanExtra"
  );

  console.log("Deploying KatsuraOjisanExtra contract");
  const extraContract = await extraFactory.deploy();
  await extraContract.deployed();
  console.log("KatsuraOjisan extra deployed to:", extraContract.address);

  contractAddresses.KatsuraOjisanExtra = extraContract.address;
  contractAddresses.KatsuraOjisanCondition = conditionContract.address;

  fs.writeFileSync(
    `${basePath}/src/ContractAddresses.json`,
    JSON.stringify(contractAddresses)
  );

  console.log("Deploy success!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
