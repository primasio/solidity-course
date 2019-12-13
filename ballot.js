module.exports = async function (callback) {
    try {
        //code here
        const Ballot = artifacts.require("Ballot");
        let instance = await Ballot.deployed();

        // Get account list from ganache
        let accounts = await web3.eth.getAccounts();

        // Get chairperson
        let chairperson = await instance.chairperson();
        console.log("chairperson address: " + chairperson);

        await printProposal(0, instance);
        await printProposal(1, instance);
        await printProposal(2, instance);

        await instance.giveRightToVote(accounts[1]);
        await instance.giveRightToVote(accounts[2]);

        await printVoter(accounts[0], instance);
        await printVoter(accounts[1], instance);
        await printVoter(accounts[2], instance);

        await instance.vote(0, {from: accounts[0]});
        await instance.delegate(accounts[2], {from: accounts[1]});
        await instance.vote(1, {from: accounts[2]});

        let winnerName = await instance.winnerName();
        console.log('winnerName', web3.utils.toAscii(winnerName));
    } catch (e) {
        console.log(e)
    }
    callback()
};

async function printProposal(index, instance) {
    let proposal = await instance.proposals(index);
    console.log("proposal" + index + " name: ", web3.utils.toAscii(proposal.name));
    console.log("proposal" + index + " voteCount: ", proposal.voteCount.toString());
}

async function printVoter(addr, instance) {
    let voter = await instance.voters(addr);
    console.log("---------------------------------------------------------------");
    console.log("voter addr: " + addr);
    console.log("voter: " + "weight: ", voter.weight.toString());
    console.log("voter: " + "voted: ", voter.voted);
    console.log("voter: " + "delegate: ", voter.delegate.toString());
    console.log("voter: " + "vote: ", voter.vote.toString());
    console.log("---------------------------------------------------------------");
}
