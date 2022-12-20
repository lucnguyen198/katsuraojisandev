// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const contractAddresses = require("../src/ContractAddresses.json");

async function main() {
  console.log("Clears the cache and deletes all artifacts ");
  await hre.run("clean");

  // console.log("Start verify KatsuraOjisan contract");
  // await hre.run("verify:verify", {
  //   address: contractAddresses.KatsuraOjisan
  // });

  console.log("Start verify KatsuraOjisanExtra contract");
  await hre.run("verify:verify", {
    address: contractAddresses.KatsuraOjisanExtra
  });

  // console.log("Start verify KatsuraOjisanExtraCondition contract");
  // await hre.run("verify:verify", {
  //   address: contractAddresses.KatsuraOjisanCondition
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
