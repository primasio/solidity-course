module.exports = async function (callback) {
    try {
        const BN = require("bn.js");
        let frac = new BN(10).pow(new BN(18));
        let accounts = await web3.eth.getAccounts();

        const MyToken = artifacts.require("MyToken");
        let instance = await MyToken.deployed();

        await instance.transfer(accounts[1], new BN(1).mul(frac), {from: accounts[0]});
        await instance.transfer(accounts[2], new BN(2).mul(frac), {from: accounts[0]});
        await instance.transfer(accounts[3], new BN(2).mul(frac), {from: accounts[0]});
        callback()
    } catch (e) {
        callback(e)
    }
};
