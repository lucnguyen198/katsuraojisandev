# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```


Contract deploy guide(testnet: mumbai)

1. Change provider url and account private key in secrets.json
2. Check account balance
3. Check hardhat.config.js
4. Compile contracts: npx hardhat compile
5. Add test case for new functions in test/sample-test.js
6. Run unit test: npx hardhat test
7. Deploy contracts: npx hardhat run scripts/KatsuraOjisanDeploy.js --network mumbai
8. Verify Contracts: npx hardhat run scripts/VerifyContracts.js --network mumbai

※ WhitelistSale: 
    1: Check whitelist addresses in src/WhitelistAddresses.js
    2: Set MerkleRoot: npx hardhat run scripts/SetMerkleRoot.js --network mumbai
    3: Enable whitelistSale: npx hardhat run scripts/SetWhitelistSale.js --network mumbai

※ PublicSale: npx hardhat run scripts/SetPublicSale.js --network mumbai

※ Stop WhitelistSale: npx hardhat run scripts/StopWhitelistSale.js --network mumbai

※ Stop PublicSale: npx hardhat run scripts/StopPublicSale.js --network mumbai

※ Reveal NFT: npx hardhat run scripts/RevealNFT.js --network mumbai
    + Set attribute contract for main contract
    + Set reveal uri(ipfs)
    + Set revealed = true

※ OwnerMint: npx hardhat run scripts/OwnerMint.js --network mumbai
※ Setting collection info on opensea after ownermint

