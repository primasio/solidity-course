const Ballot = artifacts.require("Ballot");

module.exports = function(deployer) {
    deployer.deploy(Ballot,[web3.utils.fromAscii('p0'), web3.utils.fromAscii('p1'), web3.utils.fromAscii('p2')]);
};
