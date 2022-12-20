const whitelistAddresses = require("./WhitelistAddresses.json");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const buf2hex = x => "0x" + x.toString("hex");

const getMerkleRoot = () => {
  // const listAddress = JSON.Parse(whitelistAddresses);
  const leaves = whitelistAddresses.map(x => keccak256((x || "").toLowerCase()));
  const tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
  const merkleRoot = tree.getRoot();

  return merkleRoot;
};

const getProof = address => {
  //const listAddress = JSON.Parse(whitelistAddresses);
  const leaves = whitelistAddresses.map(x => keccak256((x || "").toLowerCase()));
  const tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
  //const merkleRoot = tree.getRoot();
  const leaf = keccak256((address || "").toLowerCase());
  let proof = tree.getProof(leaf).map(x => buf2hex(x.data));
  return proof;
};

module.exports = { getMerkleRoot, getProof };
