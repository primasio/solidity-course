pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract EthBet {

    using SafeMath for uint256;

    constructor () public {}

    event BetAmountIncreased(uint256 amount);
    event BetFinished();

    function () external payable {
        require(msg.value > 0);
        emit BetAmountIncreased(msg.value);
    }

    function submitResult(int r) public returns (bool) {

        uint256 betAmount = address(this).balance;

        require(betAmount != 0);

        if ( r == 1 + 1) {
            msg.sender.transfer(betAmount);
            emit BetFinished();
            return true;
        } else {
            return false;
        }
    }
}
