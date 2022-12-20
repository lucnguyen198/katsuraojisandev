// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
const contractAddresses = require("../src/ContractAddresses.json");
const basePath = process.cwd();

let tokenId = 1;// if token data save fail edit this variable to re-save
const MAX_SUPPLY = 1111;
async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Account balance:", (await deployer.getBalance()).toString());
  // We get the contract to deploy
  console.log(
    "Save attribute data to contract: " + contractAddresses.KatsuraOjisanAttribute
  );
  const contract = await (
    await ethers.getContractFactory("KatsuraOjisanAttribute")
  ).attach(contractAddresses.KatsuraOjisanAttribute);

  while (tokenId <= MAX_SUPPLY) {
    let rawdata = fs.readFileSync(`${basePath}/AttributeData/${tokenId}.json`);
    let data = JSON.parse(rawdata);
    let attributes = [];
    for (i = 0; i < data.attributes.length; i++) {
      attributes.push(JSON.stringify(data.attributes[i]));
    }
    console.log("Saving token data #" + tokenId);
   const tx = await contract.addAttributes(tokenId, attributes);
   await tx.wait();
    console.log("Token data #" + tokenId + " saved!");
    tokenId++;
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    console.log("Token data #" + tokenId + " save fail");
    process.exit(1);
  });
