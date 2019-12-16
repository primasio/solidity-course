module.exports = async function (callback) {
    try {
        const BN = require("bn.js");
        let frac = new BN(10).pow(new BN(18));
        let accounts = await web3.eth.getAccounts();
        let to_address = '0x6CceC759ed8C017d2856c91AB8F2f014f03Ae5d2';
        await web3.eth.sendTransaction(
            {
                from: accounts[0],
                to: to_address,
                value: new BN(20).mul(frac)
            });
        callback()
    } catch (e) {
        callback(e)
    }
};
