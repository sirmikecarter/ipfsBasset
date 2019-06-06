pragma solidity ^0.5.1;

contract bassetContract {
    string ipfsHash;

    function setHash(string memory x) public {
        ipfsHash = x;
    }

    function getHash() public view returns (string memory x)
    {   return ipfsHash;

    }
}
