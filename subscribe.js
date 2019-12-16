module.exports = async function (callback) {
    try {
        const BN = require("bn.js");
        let frac = new BN(10).pow(new BN(18));

        const MyToken = artifacts.require("MyToken");
        let instance = await MyToken.deployed();

        instance.Transfer().on('data', function (event) {
            console.log('-----------------------------------------------');
            console.log('from', event.args.from);
            console.log('to', event.args.to);
            console.log('value', event.args.value.div(frac).toString());
        });

    } catch (e) {
        callback(e)
    }
};
