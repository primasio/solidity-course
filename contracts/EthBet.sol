pragma solidity ^0.5.0;

import "./SafeMath.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract EthBet is Ownable {

    using SafeMath for uint256;

    mapping(address => uint256) private _depositedAmounts;
    address payable [] private  _initializers;

    constructor () public {}

    event BetAmountIncreased(uint256 amount);
    event BetFinished();
    event BetCancelled();

    function() external payable {
        require(msg.value > 0);

        if (_depositedAmounts[msg.sender] == 0) {
            _initializers.push(msg.sender);
        }

        _depositedAmounts[msg.sender] = _depositedAmounts[msg.sender].add(msg.value);

        emit BetAmountIncreased(msg.value);
    }

    function cancel() public onlyOwner {
        uint i = 0;

        for (i = 0; i < _initializers.length; i++) {
            _initializers[i].transfer(_depositedAmounts[_initializers[i]]);
        }

        emit BetCancelled();
    }

    function submitResult(int r) public returns (bool) {

        uint256 betAmount = address(this).balance;

        require(betAmount != 0);

        if (r == 1 + 1) {
            msg.sender.transfer(betAmount);
            emit BetFinished();
            return true;
        } else {
            return false;
        }
    }
}
