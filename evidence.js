module.exports = async function (callback) {
    try {
        let accounts = await web3.eth.getAccounts();

        const Evidence = artifacts.require("Evidence");
        let instance = await Evidence.deployed();

        let content = "Hello World!";
        let contentHash = web3.utils.sha3(content, {encoding: "hex"});

        let existed = await instance.exists(contentHash);
        console.log('existed: ', existed);

        let result = await instance.save(contentHash, {from: accounts[0]});
        console.log('transaction hash: ', result.tx);      //(string) - Transaction hash
        console.log('logs: ', result.logs);    //(array) - Decoded events (logs)
        console.log('receipt: ', result.receipt); //(object) - Transaction receipt (includes the amount of gas used)

        existed = await instance.exists(contentHash);
        console.log('existed: ', existed);

        callback()
    } catch (e) {
        callback(e)
    }
};
