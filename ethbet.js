const BN = require("bn.js");
const EthBet = artifacts.require("EthBet");

let frac = new BN(10).pow(new BN(18));

module.exports = async function (callback) {

    try {
        let instance = await EthBet.deployed();
        console.log("Contract instance address: " + instance.address);

        // Get account list from Ganache

        let accounts = await web3.eth.getAccounts();

        if (accounts.length < 2) {
            callback(new Error("accounts not enough"));
            return;
        }

        console.log("Initial balances: ");

        console.log("Accounts: ");
        await printBalance(accounts[0]);
        await printBalance(accounts[1]);

        console.log("Contract: ");
        await printBalance(instance.address);

        // Send Ether to init bet

        let betAmount = new BN(1).mul(frac);
        response = await instance.send(betAmount, {from: accounts[0]});

        console.log("Transaction hash: " + response.tx);

        console.log("Balances after initBet: ");

        console.log("Accounts: ");
        await printBalance(accounts[0]);
        await printBalance(accounts[1]);

        console.log("Contract: ");
        await printBalance(instance.address);

        // Submit result

        let result = 2;
        response = await instance.submitResult(result, {from: accounts[1]});

        console.log("Transaction hash: " + response.tx);

        console.log("Balances after submitResult: ");

        console.log("Accounts: ");
        await printBalance(accounts[0]);
        await printBalance(accounts[1]);

        console.log("Contract: ");
        await printBalance(instance.address);

        callback();
    } catch (e) {
        callback(e);
    }
};

async function printBalance(account) {
    console.log("---------------------------------------------------------------");
    console.log("Account: " + account);
    let balance = await web3.eth.getBalance(account);

    console.log("Balance: " + balance);
    console.log("---------------------------------------------------------------");
}
