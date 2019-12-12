pragma solidity ^0.5.0;

/// @title 代理投票
contract Ballot {
    // 定义了一个新的复杂类型
    // 它用来表示单个投票人
    struct Voter {
        uint weight; // weight会因为得到投票而累计
        bool voted;  // true代表这个投票人已经完成投票
        address delegate; // 投票人选择的代理者地址
        uint vote;   // 该投票人所选择的提案编号
    }

    // 提案类型
    struct Proposal {
        bytes32 name;   // 提案名称
        uint voteCount; // 提案获得的投票数
    }

    address public chairperson; // 主席的地址，也是合约创建者的地址

    // 这里定义了一个映射结构
    // 存储了Voter（投票人）和他们的地址之间的关联关系
    mapping(address => Voter) public voters;

    // 动态长度的“提案”类型数组
    Proposal[] public proposals;

    /// 创建一次新的投票过程，需要传入所有提案的名称
    constructor(bytes32[] memory proposalNames) public {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        // 为每个传入的提案名称，
        // 创建一个新的Proposal对象
        // 并加到数组的末尾。
        for (uint i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` 声明了一个临时的Proposal对象
            // `proposals.push(...)`把这个对象加入到了proposals数组的末尾
            proposals.push(Proposal({
                name : proposalNames[i],
                voteCount : 0
                }));
        }
    }

    // 把投票权给address代表的投票人
    // 该方法只能由本次投票的“主席”调用
    function giveRightToVote(address voter) public {
        // 如果require方法的第一个参数为false
        // 那么合约执行将被终止，所有对区块链状态和账户余额的修改
        // 都会被回滚。
        // 在旧的EVM版本中，这样的行为会消耗本次交易所有的gas
        // 但是现在不会了。
        // 通常，利用require来检查函数是否被正确调用是个比较好的策略
        // 对于require方法的第二个参数, 你可以提供一个发生错误的解释
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    /// 调用此方法将你的投票权交由另一个投票者（to）代理
    function delegate(address to) public {
        // 注意这里的storage关键字的声明，sender变量获得的是一个状态变量（reference type）
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");

        // 如果代理者to也选择代理，就把票转发给下一个代理
        // 通常来说，在以太坊上进行这样的循环转发是很危险的
        // 因为它很有可能耗尽区块中所有可用的gas
        // 在这种情况下，代理行为将被终止
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;

            // 如果发现了代理循环, 就终止.
            require(to != msg.sender, "Found loop in delegation.");
        }

        // 由于sender是一个引用, 这样就可以
        // 修改voters[msg.sender].voted状态变量的值
        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {
            // 如果最终的代理者已经投过票了
            // 就把这个票加到代理者投的提议上
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            // 否则
            // 就增加最终代理者的weight
            delegate_.weight += sender.weight;
        }
    }

    /// 把你的票 (包括其他人代理给你的)
    /// 投给某个提案 `proposals[proposal].name`.
    function vote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        // 如果 `proposal` 超过了数组的边界,
        // 将会自动的抛出异常并回滚
        proposals[proposal].voteCount += sender.weight;
    }

    /// 计算最终获得最多投票的提案
    function winningProposal() public view
    returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // 调用 winningProposal() 获得获胜提案的编号
    // 然后返回这个提案的名称
    function winnerName() public view
    returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}
