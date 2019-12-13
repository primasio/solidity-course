module.exports = async function (callback) {
    try {
        let accounts = await web3.eth.getAccounts();

        const Evidence = artifacts.require("Evidence");
        let instance = await Evidence.deployed();

        let existed = await instance.exists('0x0000000000000000000000000000000000000000000000000000000000000001');
        console.log('existed: ', existed);

        let result = await instance.save('0x0000000000000000000000000000000000000000000000000000000000000001', {from: accounts[0]});
        console.log('transaction hash: ', result.tx);      //(string) - Transaction hash
        console.log('logs: ', result.logs);    //(array) - Decoded events (logs)
        console.log('receipt: ', result.receipt); //(object) - Transaction receipt (includes the amount of gas used)

        existed = await instance.exists('0x0000000000000000000000000000000000000000000000000000000000000001');
        console.log('existed: ', existed);

        callback()
    } catch (e) {
        callback(e)
    }
};
