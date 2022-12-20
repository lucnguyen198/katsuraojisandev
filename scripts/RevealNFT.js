// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const contractAddresses = require("../src/ContractAddresses.json");
// const urlPrefix = "https://api.opensea.io/api/v1/asset/matic/";
// const urlAffix = "/?force_update=true";
// const axios = require('axios').default;
async function main() {
  // We get the contract to deploy
  const contract = await (
    await ethers.getContractFactory("KatsuraOjisan")
  ).attach(contractAddresses.KatsuraOjisan);

  console.log("Setting RevealURI");
  const tx2 = await contract.setRevealURI(
    "ipfs://QmQipCcSzP7QRxow5ueKdWw95dJgFxVe1SYQ4PL1tQyWQ4/"
  );
  await tx2.wait();
  console.log("Setting RevealURI success");

  console.log("Revealing NFT");
  const tx3 = await contract.revealNFT();
  await tx3.wait();
  console.log("Success");

  // console.log("Force update metadata");
  // const totalSupply = await contract.totalSupply();
  // let tokenId = 1;
  // while(tokenId <= totalSupply)
  // {
  //   const url = urlPrefix + contractAddresses.KatsuraOjisan + "/" + tokenId + urlAffix;
  //   const response = await axios.get(url);
  //  if(response.ok)
  //  {
  //     console.log("metadata of token #"+tokenId+" updated!")
  //    tokenId++;
  //  }
  //  else
  //  {
  //     console.log("fail refresh metadata of token #"+tokenId)
  //    break;
  //  }
  // }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
