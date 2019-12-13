const Auction = artifacts.require("Auction");

module.exports = async function (deployer) {
    let accounts = await web3.eth.getAccounts();
    let NFToken = artifacts.require("NFToken");
    let tokenInstance = await NFToken.deployed();
    let result = await tokenInstance.mintTo(accounts[0], {from: accounts[0]});
    let tokenId = result.logs[0].args.tokenId;
    await deployer.deploy(Auction, 3600, accounts[0], tokenInstance.address, tokenId);
    await tokenInstance.approve(Auction.address, tokenId);
};
