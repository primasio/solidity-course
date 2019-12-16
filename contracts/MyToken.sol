pragma solidity ^0.5.0;

import "./ERC20.sol";

contract MyToken is ERC20 {

    string  public name = 'MyToken';
    uint8   public decimals = 18;
    string  public symbol = 'MYT';
    string  public version = '1.0.0';

    address payable contractCreator;
    uint ratio = 1000;

    function () external payable {
        require(msg.value > 0, "No Ether transferred");
        uint256 myTokenAmount = ratio * msg.value;
        require(balanceOf(contractCreator) > myTokenAmount, "Insufficient fund");
        _transfer(contractCreator, msg.sender, myTokenAmount);

        contractCreator.transfer(msg.value);
    }

    constructor () public {
        _mint(msg.sender, 100000000 * 10 ** 18);
        contractCreator = msg.sender;
    }


    address [] private  _tokenHolders;

    function inflate() public {

        uint256 amount = 100000 * 10 ** 18 / _tokenHolders.length;

        for (uint256 i = 0; i < _tokenHolders.length; i++) {

            if (balanceOf(_tokenHolders[i]) != 0) {
                _mint(_tokenHolders[i], amount);
            }
        }
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {

        if (balanceOf(recipient) == 0) {
            _tokenHolders.push(recipient);
        }

        return super.transfer(recipient, amount);
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function getDecimals() public view returns (uint8) {
        return decimals;
    }

    function getSymbol() public view returns (string memory) {
        return symbol;
    }

    function getVersion() public view returns (string memory) {
        return version;
    }

}
