pragma solidity ^0.5.0;

import "./NFTokenInterface.sol";
contract Auction {
    // ERC-721 合约接口
    NFTokenInterface nftokenContract;
    // 竞拍的初始参数：发起竞拍者和截止时间（unix timestamp）
    address payable public beneficiary;
    uint public auctionEndTime;

    // 竞拍当前状态记录
    address public highestBidder;
    uint public highestBid;
    uint public nftokenId;

    // 为完成的退款记录
    mapping(address => uint) pendingReturns;

    // 竞拍结束后设置为true，不允许任何后续修改
    // 默认初始化为false
    bool ended;

    // 竞拍事件
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    /// 创建一个竞拍，传入竞拍发起人地址 _beneficiary
    /// ERC-721 token 合约地址 nftokenAddr
    /// 抵押的token id
    /// 竞拍持续时间 _biddingTime
    constructor(
        uint _biddingTime,
        address payable _beneficiary,
        address nftokenAddr,
        uint _tokenId
    ) public {
        nftokenContract = NFTokenInterface(nftokenAddr);
        require(nftokenContract.ownerOf(_tokenId) == _beneficiary);
        nftokenId = _tokenId;
        beneficiary = _beneficiary;
        auctionEndTime = now + _biddingTime;
    }

    /// 通过发送转账交易来参与竞拍
    /// 未成功的竞拍转账可以赎回
    function bid() public payable {
        // 如果竞拍截止时间已过，则执行回滚
        require(
            now <= auctionEndTime,
            "Auction already ended."
        );

        // 出价不是最高价，执行回滚
        require(
            msg.value > highestBid,
            "There already is a higher bid."
        );

        if (highestBid != 0) {
            // 产生了一个新的最高价，则上一个出最高价者的资金应该被退回
            // 这里是记录了退款数量，用户可以通过合约的Withdraw方法赎回
            pendingReturns[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /// 赎回未成功的竞价
    function withdraw() public returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // 必须在发送前清空退款记录
            pendingReturns[msg.sender] = 0;

            if (!msg.sender.send(amount)) {
                // 如果发送失败，就恢复退款记录
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    /// 结束竞拍
    function auctionEnd() public {
        // 1. 检查竞拍结束条件
        require(now >= auctionEndTime, "Auction not yet ended.");
        require(!ended, "auctionEnd has already been called.");
        require(nftokenContract.getApproved(nftokenId) == address(this), "The token in action has not been approved.");

        // 2. 修改自身状态
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // 3. 与外部合约交互
        nftokenContract.safeTransferFrom(beneficiary, highestBidder, nftokenId);
        beneficiary.transfer(highestBid);
    }
}
