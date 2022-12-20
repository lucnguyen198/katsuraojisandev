// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IKatsuraOjisan
{
  function balanceOf(address owner) external view returns(uint256);
}

contract KatsuraOjisanExtraCondition is Ownable
{
    IKatsuraOjisan public katsuraOjisanContract;

    function SetContract(address _address) external onlyOwner
    {
        katsuraOjisanContract = IKatsuraOjisan(_address);
    }

    function EventCondition(address _address) public view returns(bool)
    {
        return katsuraOjisanContract.balanceOf(_address) > 0;
    }
}