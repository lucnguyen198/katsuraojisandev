export const getConfig = () => {
  return {
    NETWORK: {
      NAME: "Matic Mumbai Testnet",
      SYMBOL: "MATIC",
      ID: 80001,
      CHAINID: "0x13881",
      RPCURLS: "https://rpc-mumbai.maticvigil.com",
      SCAN_LINK: "https://mumbai.polygonscan.com/"
    },
    NFT_NAME: "KatsuraOjisan",
    SYMBOL: "KOJ",
    MAX_SUPPLY: 1111,
    GAS_PRICE: 32000000000 //32GWEI -- polygon min gas price: 30 GWEI
  };
};
