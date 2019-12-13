const MyToken = artifacts.require("MyToken");
const NFToken = artifacts.require("NFToken");
const Ballot = artifacts.require("Ballot");

module.exports = function(deployer) {
    deployer.deploy(MyToken);
    deployer.deploy(NFToken, 'MyNFToken', 'SC');
    deployer.deploy(Ballot,[web3.utils.fromAscii('p1'), web3.utils.fromAscii('p2'), web3.utils.fromAscii('p3')]);
};
