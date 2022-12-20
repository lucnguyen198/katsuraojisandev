const hre = require("hardhat");
const whitelistAddresses = require("../src/WhitelistAddresses.json");
// const urlPrefix = "https://api.opensea.io/api/v1/asset/matic/";
// const urlAffix = "/?force_update=true";
// const axios = require('axios').default;
async function main() {
  console.log("Checking invalid addresses");
  //   const lowercaseArr = whitelistAddresses.map(add => {
  //     return add.toLowerCase();
  //   });

  for (let i = 0; i < whitelistAddresses.length; i++) {
    if (!ethers.utils.isAddress(whitelistAddresses[i])) {
      console.log("Invalid address: " + whitelistAddresses[i]);
    }
    if (isDuplicate(whitelistAddresses[i])) {
      console.log("Duplicate address: " + whitelistAddresses[i]);
    }
  }

  console.log("Checking duplicate addresses");
}

function isDuplicate(address) {
  let count = 0;
  for (let i = 0; i < whitelistAddresses.length; i++) {
    if (whitelistAddresses[i].toLowerCase() == address.toLowerCase()) {
      count++;
    }
    if (count > 1) return true;
  }
  return false;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
