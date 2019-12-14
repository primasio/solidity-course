const BN = require("bn.js");
module.exports = async function (callback) {
    try {
        let frac = new BN(10);
        frac = frac.pow(new BN(18));
        let NFToken = artifacts.require("NFToken");
        let tokenInstance = await NFToken.deployed();

        let Auction = artifacts.require("Auction");
        let auctionInstance = await Auction.deployed();

        let tokenId = await auctionInstance.nftokenId();
        await auctionInstance.auctionEnd();

        let balance = await web3.eth.getBalance(auctionInstance.address);
        balance = new BN(balance).div(frac);
        console.log('auction balance end: ', balance.toString());

        owner = await tokenInstance.ownerOf(tokenId);
        console.log('owner after: ', owner);
        callback()
    } catch (e) {
        callback(e);
    }
};
