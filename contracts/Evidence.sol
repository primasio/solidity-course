pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Evidence is Ownable {
    mapping(bytes32 => bool) evidence;

    event Save(bytes32 hash);

    function save(bytes32 hash) public onlyOwner {
        if (!evidence[hash]) {
            evidence[hash] = true;
            emit Save(hash);
        }
    }

    function exists(bytes32 hash) public view returns (bool){
        return evidence[hash];
    }
}
