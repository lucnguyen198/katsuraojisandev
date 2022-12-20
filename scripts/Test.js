// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const contractAddresses = require("../src/ContractAddresses.json");
const { getProof } = require("../src/WhitelistUtil");
require('dotenv').config();
async function main() {
  // We get the contract to deploy
  const contract = await (
    await ethers.getContractFactory("KatsuraOjisanExtra")
  ).attach(contractAddresses.KatsuraOjisanExtra);
  const eventData = await contract.events(process.env.REACT_APP_EVENT_ID);
  console.log(eventData);
  console.log("done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
