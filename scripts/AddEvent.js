// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const contractAddresses = require("../src/ContractAddresses.json");
require("dotenv").config();
async function main() {
  // We get the contract to deploy
  const contract = await (
    await ethers.getContractFactory("KatsuraOjisanExtra")
  ).attach(contractAddresses.KatsuraOjisanExtra);
  console.log("Add event");
  const maxSupply = 60;
  const maxMintPerAddress = 1;
  const isSame = false;
  const isRandom = true;
  const ipfs = "ipfs://QmP2y4shp4dR22HoEGYYc9H7xkkZuDqAhmwmB8bw9EA3w5/"; // add "/" in last if isSame == false
  const tx = await contract.addEvent(
    process.env.REACT_APP_EVENT_ID,
    maxSupply,
    maxMintPerAddress,
    ipfs,
    contractAddresses.KatsuraOjisanCondition,
    isSame,
    isRandom
  );
  await tx.wait();
  console.log("Success");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
