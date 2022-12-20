const hre = require("hardhat");
const contractAddresses = require("../src/ContractAddresses.json");

const MAX_MINT_AMOUNT = 5;
async function main() {
  const OwnerMintData = [
    { address: "0x91f5914A70C1F5d9fae0408aE16f1c19758337Eb", amount: 10 },
    { address: "0x561D4C86576C9E1675F1f77318ECfc18EC85D9Dc", amount: 10 },
    { address: "0x05510B3EfaB4b8FdFf5ED2C872DB90511043064D", amount: 96 }
  ];
  const factory = await ethers.getContractFactory("KatsuraOjisan");
  const contract = await factory.attach(contractAddresses.KatsuraOjisan);
  for (let i = 0; i < OwnerMintData.length; i++) {
    const data = OwnerMintData[i];
    if (!ethers.utils.isAddress(data.address)) {
      console.log("not valid address: " + data.address);
      continue;
    }
    const loopSize = Math.floor(data.amount / MAX_MINT_AMOUNT);
    for (let j = 0; j < loopSize; j++) {
      const tx = await contract.ownerMint(MAX_MINT_AMOUNT, data.address);
      await tx.wait();
      console.log(MAX_MINT_AMOUNT + " NFT minted for address " + data.address);
    }
    const remainCount = data.amount - loopSize * MAX_MINT_AMOUNT;
    if (remainCount > 0) {
      const tx = await contract.ownerMint(remainCount, data.address);
      await tx.wait();
      console.log(remainCount + " NFT minted for address " + data.address);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
