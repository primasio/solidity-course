module.exports = async function (callback) {
  try {
      let accounts = await web3.eth.getAccounts();

      let NFToken = artifacts.require("NFToken");
      let instance = await NFToken.deployed();

      let result = await instance.mintTo(accounts[0], {from:accounts[0]});
      let tokenId = result.logs[0].args.tokenId;
      console.log('mint token id: ', tokenId.toString());

      let owner = await instance.ownerOf(tokenId);
      console.log('owner: ', owner);

      await instance.safeTransferFrom(owner, accounts[1], tokenId);

      owner = await instance.ownerOf(tokenId);
      console.log('after transferring, owner: ', owner);

      await instance.approve(accounts[2], tokenId, {from: accounts[1]});
      await instance.safeTransferFrom(accounts[1], accounts[0], tokenId, {from:accounts[2]});

      owner = await instance.ownerOf(tokenId);
      console.log('after approving and transferring, owner: ', owner);

      callback()
  } catch (e) {
      callback(e);
  }
};
