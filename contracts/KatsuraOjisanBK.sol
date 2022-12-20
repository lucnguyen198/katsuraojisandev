// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


interface IKatsuraOjisanAttribute
{
  function getAttributes(uint256 _token) external view returns(string[] memory);
  function isKatsuraOjisanAttribute() external pure returns (bool);
}

contract KatsuraOjisanBK is ERC721Enumerable, Ownable {
  using Strings for uint256;

    bytes32 public merkleRoot;
    address public attributeAddress;
    IKatsuraOjisanAttribute public  attributeContract;
    string public revealURI;
    string public notRevealURI = "ipfs://QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH";
    uint256 public maxSupply = 1111;
    uint256 public maxMintPerTX = 5;
    uint256 public maxMintsPerWL = 5;
    uint256 public maxMintsPerPS = 5;
    bool public revealed = false;
    bool public isWhitelistSale = false;
    bool public isPublicSale = false;
    mapping(address => uint256) public psMinted;
    mapping(address => uint256) public wlsMinted;

    constructor() ERC721("Katsura Ojisan", "KOJ") {
        
    }

    function setAttributeAddress(address _address) external onlyOwner {
        attributeContract = IKatsuraOjisanAttribute(_address);
        attributeAddress = _address;
    }

    function setPublicSale(bool _enable) public onlyOwner
    {
        isPublicSale = _enable;
    }

    function setWhitelistSale(bool _enable) public onlyOwner
    {
        isWhitelistSale = _enable;
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function revealNFT() public onlyOwner
    {
        revealed = true;
    }

    function isWhitelisted(address _address, bytes32[] calldata _proof) public view returns(bool)
    {
        return MerkleProof.verify(_proof, merkleRoot, keccak256(abi.encodePacked(_address)));
    }

    function ownerMint(uint256 _mintAmount, address _address) public onlyOwner 
    {
        require(_mintAmount > 0 && _mintAmount <= maxMintPerTX, "invalid amount");
        uint256 mSupply = totalSupply();
        require((_mintAmount + mSupply) <= (maxSupply), "limit exceeded");

        for (uint256 i = 1; i <= _mintAmount; i++) 
        {
            uint256 mTokenId = mSupply + i;
            _safeMint(_address, mTokenId);
        }
    }

    function whitelistMint(uint _mintAmount, bytes32[] calldata _proof) public {
        require(_mintAmount > 0 && _mintAmount <= maxMintPerTX, "invalid amount");
        require(isWhitelistSale, "not live");
        require(isWhitelisted(msg.sender, _proof),"Not in whitelist");
        uint256 mSupply = totalSupply();
        require((mSupply + _mintAmount <= maxSupply) && (wlsMinted[msg.sender] + _mintAmount <= maxMintsPerWL), "limit exceeded");
        for (uint256 i = 1; i <= _mintAmount; i++) 
        {
            uint256 mTokenId = mSupply + i;
            wlsMinted[msg.sender]++;
            _safeMint(msg.sender, mTokenId);
        }
    }

    function publicSaleMint(uint _mintAmount) public {
        require(_mintAmount > 0 && _mintAmount <= maxMintPerTX, "invalid amount");
        require(isPublicSale, "not live");
        uint256 mSupply = totalSupply();
        require((mSupply + _mintAmount <= maxSupply) && (psMinted[msg.sender] + _mintAmount <= maxMintsPerPS), "limit exceeded");
        for (uint256 i = 1; i <= _mintAmount; i++) 
        {
            uint256 mTokenId = mSupply + i;
            psMinted[msg.sender]++;
            _safeMint(msg.sender, mTokenId);
        }
    }

    function setRevealURI(string memory _uri) public onlyOwner {
        revealURI = _uri;
    }

    function setNotRevealURI(string memory _uri) public onlyOwner {
        notRevealURI = _uri;
    }

    function buildMetadata(uint256 _tokenId) private view returns(string memory) {
        string memory mId = _tokenId.toString();
        string memory mName = string(abi.encodePacked("Katsura Ojisan #", mId));
        string memory mImage = string(abi.encodePacked(revealURI,mId,".png"));
        string memory mAttribute ="[";
        string[] memory attributeList = attributeContract.getAttributes(_tokenId);
        for (uint8 i = 0; i < attributeList.length; i ++)
        {
            if(i == attributeList.length -1)
                mAttribute = string(abi.encodePacked(mAttribute,attributeList[i]));
            else
                mAttribute = string(abi.encodePacked(mAttribute,attributeList[i],","));
        }
        mAttribute = string(abi.encodePacked(mAttribute,"]"));
        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    abi.encodePacked('{"name":"', mName, '", "description":"', mName, '", "image": "', mImage,'","attributes":',mAttribute,'}')
                )
            )
        );
    }

    function buildNotRevealedMetadata(uint256 _tokenId) private view returns(string memory) {
        string memory mId = _tokenId.toString();
        string memory mName = string(abi.encodePacked("Katsura Ojisan #", mId));
        string memory mDescription =  string(abi.encodePacked("Katsura Ojisan #", mId));
        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    abi.encodePacked('{"name":"', mName, '", "description":"', mDescription, '", "image": "', notRevealURI,'"}')
                )
            )
        );
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId),"nonexistent token");
        if(!revealed)
        {
            return buildNotRevealedMetadata(_tokenId);
        }
        return buildMetadata(_tokenId);
    }

}