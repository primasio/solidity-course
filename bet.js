const BN = require("bn.js");
const Bet = artifacts.require("Bet");

module.exports = async function (callback) {

    try {
        let instance = await Bet.deployed();
        console.log("Contract instance address: " + instance.address);

        // Get account list from Ganache

        let accounts = await web3.eth.getAccounts();

        if (accounts.length < 2) {
            callback(new Error("accounts not enough"));
            return;
        }

        await printBalance(accounts[0], instance);
        await printBalance(accounts[1], instance);

        // Add some balances to the addresses;

        let amount = new BN(200);
        let response = await instance.addBalance(amount, {from: accounts[0]});

        console.log("Transaction hash: " + response.tx);

        await printBalance(accounts[0], instance);
        await printBalance(accounts[1], instance);

        // Init bet

        let betAmount = new BN(100);
        response = await instance.initBet(betAmount, {from: accounts[0]});

        console.log("Transaction hash: " + response.tx);

        await printBalance(accounts[0], instance);
        await printBalance(accounts[1], instance);

        // Submit result

        let result = 2;
        response = await instance.submitResult(result, {from: accounts[1]});

        console.log("Transaction hash: " + response.tx);

        await printBalance(accounts[0], instance);
        await printBalance(accounts[1], instance);

        callback();
    } catch (e) {
        callback(e);
    }
};

async function printBalance(account, instance) {
    console.log("---------------------------------------------------------------");
    console.log("Account: " + account);
    let balance = await instance.getBalance(account);
    console.log("Balance: " + balance.toString());
    console.log("---------------------------------------------------------------");
}
