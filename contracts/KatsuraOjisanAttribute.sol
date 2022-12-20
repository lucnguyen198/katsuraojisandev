// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KatsuraOjisanAttribute is Ownable
{
    bool public isKatsuraOjisanAttribute = true;
    mapping(uint256 => string[]) attributes;
    function addAttributes(uint256 _token, string[] calldata _attribute) external onlyOwner 
    {
        //clear old values
        string[] storage listAttribute = attributes[_token];
        uint256 length = listAttribute.length;
        for (uint256 i = 0; i < length; i++)
        {
            listAttribute.pop();
        }

         for (uint256 i = 0; i < _attribute.length; i++)
        {
            attributes[_token].push(_attribute[i]);
        }
    }


    function getAttributes(uint256 _token) public view returns(string[] memory)
    {
        return attributes[_token];
    }
}