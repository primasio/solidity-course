const MyToken = artifacts.require("MyToken");
const NFToken = artifacts.require("NFToken");

module.exports = function(deployer) {
    deployer.deploy(MyToken);
    deployer.deploy(NFToken, 'MyNFToken', 'SC');
};
