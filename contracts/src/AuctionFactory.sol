// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import {Auction} from "./Auction.sol";

contract AuctionFactory {
    address[] public auctions;

    event AuctionCreated(
        address auctionContract,
        address owner,
        uint256 numAuctions,
        address[] allAuctions
    );

    constructor() {}

    function createAuction(
        uint256 bidIncrement,
        uint256 bidDuration,
        string memory imgUrl
    ) public {
        Auction newAuction = new Auction(
            msg.sender,
            bidIncrement,
            bidDuration,
            imgUrl
        );
        auctions.push(address(newAuction));

        emit AuctionCreated(
            address(newAuction),
            msg.sender,
            auctions.length,
            auctions
        );
    }

    function allAuctions() public view returns (address[] memory) {
        return auctions;
    }
}
