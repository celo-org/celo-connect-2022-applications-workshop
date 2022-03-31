import stylesCard from "./AuctionCard.module.css";
import { useContractKit, UseContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState, useMemo, useCallback } from "react";

import AuctionABI from "../../contracts/build/Auction.json";
import { Auction as AuctionContract } from "../../contracts/typings/Auction";
import Img from "../Base/Image";
import HighestBid from "./AuctionCardInfo/HighestBid";
import BidButton from "./AuctionCardInfo/BidButton";
import TimeLeft from "./AuctionCardInfo/TimeLeft";
import OwnerActions from "./AuctionCardInfo/OwnerActionButtons";

const getContract = (kit: UseContractKit["kit"], abi: any, address: string) => {
  return new kit.web3.eth.Contract(abi, address);
};

export enum AuctionStatus {
  CANCELED = "Canceled",
  ENDED = "Ended",
  ACTIVE = "Active",
}

const AuctionCard = ({
  auctionContractAddress,
}: {
  auctionContractAddress: string;
}) => {
  const [url, setUrl] = useState("");
  const [owner, setOwner] = useState("");
  const [highestBidder, setHighestBidder] = useState<string>("");
  const [highestBid, setHighestBid] = useState<string>("");
  const [canBid, setCanBid] = useState(true);
  const allowBid = useCallback((bool: boolean) => {
    setCanBid(bool);
  }, []);

  const { kit, address: walletAddress } = useContractKit();

  const auctionContract = useMemo(
    () => getContract(kit, AuctionABI.abi, auctionContractAddress),
    [kit, auctionContractAddress]
  ) as unknown as AuctionContract;

  useEffect(() => {
    const getAuctionData = async () => {
      const [url, highestBidderAddress, highestBindingBid, owner] =
        await Promise.all(
          [
            auctionContract.methods.imgUrl(),
            auctionContract.methods.highestBindingBid(),
            auctionContract.methods.highestBindingBid(),
            auctionContract.methods.owner(),
          ].map((x) => x.call())
        );

      setUrl(url);
      setOwner(owner);
      setHighestBidder(highestBidderAddress);
      setHighestBid(highestBindingBid);
    };

    getAuctionData();
  }, [auctionContract]);

  const isOwnerOfAuction = owner === walletAddress;
  const isHighestBidder = highestBidder === walletAddress;
  const bidButtonDisabled = isHighestBidder || !canBid;
  return (
    <div className={stylesCard.card}>
      <Img url={url} />
      <div className={stylesCard.cardContent}>
        <div className={stylesCard.cardInfo}>
          <HighestBid
            highestBidderAddress={highestBidder}
            highestBid={highestBid}
          />
          <TimeLeft auctionContract={auctionContract} allowBid={allowBid} />
        </div>
        <div className={stylesCard.actionsContainer}>
          {isOwnerOfAuction ? (
            <OwnerActions auctionContract={auctionContract} />
          ) : (
            <BidButton
              auctionContract={auctionContract}
              disabled={bidButtonDisabled}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
