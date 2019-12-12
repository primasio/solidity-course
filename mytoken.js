const BN = require("bn.js");

const MyToken = artifacts.require("MyToken");

let frac = new BN(10);

module.exports = async function (callback) {

    // Get the deployed instance of our token contract
    let instance = await MyToken.deployed();
    console.log("Contract instance address: " + instance.address);

    // Get token name
    let name = await instance.getName();
    console.log("Token name: " + name);

    // Check decimals
    let decimals = await instance.getDecimals();
    console.log("Token decimals: " + decimals);

    frac = frac.pow(new BN(decimals));

    // Check the total supply
    let totalSupply = await instance.totalSupply();
    console.log("Total supply: " + totalSupply.div(frac).toString());

    // Get account list from ganache
    let accounts = await web3.eth.getAccounts();

    if (accounts.length < 2) {
        callback(new Error("accounts not enough"));
        return;
    }

    // Show account balances
    console.log("Before transferring:");
    await printBalance(accounts[0], instance);
    await printBalance(accounts[1], instance);

    // Send a transaction to transfer 15 tokens from account 0 to account 1

    let amount = frac.mul(new BN(15));
    let response = await instance.transfer(accounts[1], amount, {from: accounts[0]});

    console.log("Transaction hash: " + response.tx);
    console.log("After transferring:");
    await printBalance(accounts[0], instance);
    await printBalance(accounts[1], instance);

    callback();
};

async function printBalance(account, instance) {
    console.log("---------------------------------------------------------------");
    console.log("Account: " + account);
    let balance = await instance.balanceOf(account);
    console.log("Balance: " + balance.div(frac).toString());
    console.log("---------------------------------------------------------------");
}
