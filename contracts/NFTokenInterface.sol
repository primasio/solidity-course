pragma solidity ^0.5.0;

contract NFTokenInterface {
    function approve(address _approved, uint256 _tokenId) external;

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external;

    function getApproved(uint256 _tokenId) external view returns (address);

    function ownerOf(uint256 _tokenId) external view returns (address);
}
