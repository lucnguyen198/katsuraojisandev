// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const contractAddresses = require("../src/ContractAddresses.json");

async function main() {
  // We get the contract to deploy
  const contract = await (
    await ethers.getContractFactory("KatsuraOjisan")
  ).attach(contractAddresses.KatsuraOjisan);
  console.log(
    "Setting not reveal uri"
  );
  const tx = await contract.setNotRevealURI("ipfs://QmemzBeatFoxF9xYtpz74fJ9mVrZ4PAkG1B3t6G1itvpgi");
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
