const BN = require("bn.js");
module.exports = async function (callback) {
    try {
        let NFToken = artifacts.require("NFToken");
        let tokenInstance = await NFToken.deployed();

        let Auction = artifacts.require("Auction");
        let auctionInstance = await Auction.deployed();

        let frac = new BN(10);
        frac = frac.pow(new BN(18));

        let accounts = await web3.eth.getAccounts();

        let tokenId = await auctionInstance.nftokenId();
        console.log('token id in this action: ', tokenId.toString());
        let owner = await tokenInstance.ownerOf(tokenId);
        console.log('owner before: ', owner);
        let balance = await web3.eth.getBalance(auctionInstance.address);
        balance = new BN(balance).div(frac);
        console.log('auction balance before: ', balance.toString());

        await auctionInstance.bid({value: frac.mul(new BN(1)), from:accounts[0]});
        await auctionInstance.bid({value: frac.mul(new BN(2)), from:accounts[1]});
        await auctionInstance.bid({value: frac.mul(new BN(3)), from:accounts[2]});

        let highestBidder = await auctionInstance.highestBidder();
        console.log('highestBidder: ', highestBidder);

        let highestBid = await auctionInstance.highestBid();
        console.log('highestBid: ', highestBid.div(frac).toString());

        balance = await web3.eth.getBalance(auctionInstance.address);
        balance = new BN(balance).div(frac);
        console.log('auction balance after: ', balance.toString());

        callback()
    } catch (e) {
        callback(e);
    }
};

