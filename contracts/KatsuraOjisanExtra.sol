// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

interface IKatsuraOjisanExtraCondition
{
  function EventCondition(address _address) external view returns(bool);
}

contract KatsuraOjisanExtra is ERC721Enumerable, Ownable {
    using Strings for uint256;
    struct KOJEvent {
    uint256 maxSupply;
    uint256 supply;
    uint256 maxMintsPerAddress;
    bool isActive;
    bool isSame;
    string uri;
    address conditionContract;
    mapping (address => uint256) balance;
    }
    mapping(uint256 => KOJEvent) public events;
    mapping (uint256 => uint256) public tokens;
    mapping (uint256 => uint256) public realTokens;

    constructor() ERC721("Katsura Ojisan Extra", "KOJE") {

    }


    function addEvent(uint256 _eventId, uint256 _maxSupply, uint256 _maxMintsPerAddress, string calldata _uri, address _conditionContract, bool _isSame) public onlyOwner
    {
        KOJEvent storage mEvent = events[_eventId];
        mEvent.maxSupply = _maxSupply;
        mEvent.maxMintsPerAddress = _maxMintsPerAddress;
        mEvent.uri = _uri;
        mEvent.conditionContract = _conditionContract;
        mEvent.isSame = _isSame;
    }

    function activeEvent(uint256 _eventId, bool _isActive) public onlyOwner
    {
        KOJEvent storage kojEvent =  events[_eventId];
        kojEvent.isActive = _isActive;
    }

    function eventCheck(uint256 _eventId, uint256 _mintAmount) public view returns(bool)
    {
        KOJEvent storage mKOJEvent =  events[_eventId];
        return (mKOJEvent.isActive && mKOJEvent.supply + _mintAmount <= mKOJEvent.maxSupply && mKOJEvent.balance[msg.sender] + _mintAmount <= mKOJEvent.maxMintsPerAddress);
    }

    function conditionCheck(uint256 _eventId, address _address) public view returns(bool)
    {
        KOJEvent storage mKOJEvent =  events[_eventId];
        IKatsuraOjisanExtraCondition mConditionContract = IKatsuraOjisanExtraCondition(mKOJEvent.conditionContract);
        return mConditionContract.EventCondition(_address);
    }

    function getEventBalance(uint256 _eventId, address _address) public view returns(uint256)
    {
        KOJEvent storage mKOJEvent =  events[_eventId];
        return mKOJEvent.balance[_address];
    }

    function mintKatsuraOjisanExtra(uint256 _eventId, uint256 _mintAmount) public
    {
        require(eventCheck(_eventId, _mintAmount),"Event check failed");
        require(conditionCheck(_eventId, msg.sender),"Condition check failed");
        KOJEvent storage mKOJEvent =  events[_eventId];
        uint256 mSupply = totalSupply() + mKOJEvent.supply;
        for (uint256 i = 1; i <= _mintAmount; i++) 
        {
            uint256 mTokenId = mSupply + i;
            mKOJEvent.supply++;
            mKOJEvent.balance[msg.sender]++;
            tokens[mTokenId] = _eventId;
            realTokens[mTokenId] = mKOJEvent.supply;
            _safeMint(msg.sender, mTokenId);
        }
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId),"nonexistent token");
        string memory mId = realTokens[_tokenId].toString();
        KOJEvent storage mKOJEvent =  events[tokens[_tokenId]];
        if(mKOJEvent.isSame)
            return mKOJEvent.uri;
        return(string(abi.encodePacked(mKOJEvent.uri, mId, ".json")));        
    }
}