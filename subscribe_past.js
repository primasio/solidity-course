module.exports = async function (callback) {
    try {
        const BN = require("bn.js");
        let frac = new BN(10).pow(new BN(18));
        let accounts = await web3.eth.getAccounts();

        const MyToken = artifacts.require("MyToken");
        let instance = await MyToken.deployed();

        let events = await instance.getPastEvents('Transfer', {fromBlock: 0, toBlock: 'latest'}, function (error) {
            console.log('error', error);
        });
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            console.log('-----------------------------------------------');
            console.log('Transfer ' + i);
            console.log('from', event.args.from);
            console.log('to', event.args.to);
            console.log('value', event.args.value.div(frac).toString());
        }

        callback()
    } catch (e) {
        callback(e)
    }
};
