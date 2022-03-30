import stylesCard from "./Info.module.css"

import BigNumber from "bignumber.js";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";

import { Auction as AuctionContract } from "../../../contracts/typings//Auction";

const HighestBidInfo = ({ auctionContract } : { auctionContract: AuctionContract }) => {
  const { address: walletAddress } = useContractKit();
  const [highestBidderAddress, setHighestBidderAddress] = useState<string>('');
  const [highestBid, setHighestBid] = useState<string>('');

  useEffect(() => {
    const getBidInfo = async () => {
      const highestBidderAddress = await auctionContract.methods.highestBidder().call();
      const highestBid = await auctionContract.methods.highestBindingBid().call();
      setHighestBidderAddress(highestBidderAddress);
      setHighestBid(highestBid);
    }

    getBidInfo();
  }, [auctionContract])

    const noBidder = new BigNumber(highestBidderAddress).eq(0);
    const bidAmount = noBidder ? "NO BID" : `${highestBid} CELO`;
    const getBidder = (highestBidderAddress: string) => {
      if (highestBidderAddress === walletAddress) {
        return "you";
      }

      return highestBidderAddress.substring(0, 5) + '...' + highestBidderAddress.substring(37 ,42);
    }
    const shortenedBidderAddress = noBidder ? ''
      : `from ${getBidder(highestBidderAddress)}`;

    return (
      <div className={stylesCard.bidOffer}>
        <div className={stylesCard.bidTitle}>Highest offer</div>
        <div className={stylesCard.bid}>{bidAmount}</div>
        <div className={stylesCard.bidTitle}>{shortenedBidderAddress}</div>
      </div>
    );
};

export default HighestBidInfo;
