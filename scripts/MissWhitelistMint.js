// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const basePath = process.cwd();
const contractAddresses = require("../src/ContractAddresses.json");
const whitelistAddresses = require("../src/WhitelistAddresses.json");
const fs = require("fs");
// const urlPrefix = "https://api.opensea.io/api/v1/asset/matic/";
// const urlAffix = "/?force_update=true";
// const axios = require('axios').default;
async function main() {
  // We get the contract to deploy
  const contract = await (
    await ethers.getContractFactory("KatsuraOjisan")
  ).attach(contractAddresses.KatsuraOjisan);

  console.log("getting missed whitelistmint addresses");
  let listNotMintedAddress =[];
  for(let i = 0;i< whitelistAddresses.length;i++)
  {
    if (!ethers.utils.isAddress(whitelistAddresses[i]))
    {
        console.log("Invalid address: " + whitelistAddresses[i]);
        continue;
    }
     const balance = await contract.balanceOf(whitelistAddresses[i]);
     if(balance == 0)
     {
         listNotMintedAddress.push(whitelistAddresses[i]);
     }
  }
  console.log("listNotMintedAddress: " + listNotMintedAddress.length);

  fs.writeFileSync(
    `${basePath}/src/WhitelistNotMintedAddresses.json`,
    JSON.stringify(listNotMintedAddress)
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
