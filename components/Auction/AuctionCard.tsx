import stylesCard from "./AuctionCard.module.css"
import { useContractKit, UseContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState, useMemo, useCallback } from "react";

import AuctionABI from "../../build/contracts/Auction.json";
import { Auction as AuctionContract } from "../../contracts-typings/Auction";
import Img from "../Base/Image";
import HighestBidInfo from "./Info/HighestBidInfo";
import BidButton from "./Info/BidButton";
import TimeLeft from "./Info/TimeLeft";
import OwnerActions from "./Info/OwnerActionButtons";

const getContract = (kit: UseContractKit['kit'], abi: any, address: string) => {
  return new kit.web3.eth.Contract(
    abi,
    address
  );
}

export enum AuctionStatus {
  CANCELED = 'Canceled',
  ENDED = 'Ended',
  ACTIVE = 'Active',
}

const AuctionCard = ({ auctionContractAddress } : { auctionContractAddress: string }) => {
  const [url, setUrl] = useState('');
  const [owner, setOwner] = useState('');
  const [canBid, setCanBid] = useState(true);
  const allowBid = useCallback(
    (bool: boolean) => {
      setCanBid(bool)
    },
    [],
  );

  const { kit, address: walletAddress } = useContractKit();

  const auctionContract = useMemo(() => getContract(kit, AuctionABI.abi, auctionContractAddress),
    [kit, auctionContractAddress])  as unknown as AuctionContract;

  useEffect(() => {
    const getAuctionData = async () => {
      const url = await auctionContract.methods.imgUrl().call();
      const owner = await auctionContract.methods.owner().call();

      setUrl(url);
      setOwner(owner);
    }

    getAuctionData();
  }, [auctionContract])

  const isOwnerOfAuction = owner === walletAddress;

  return (
    <div className={stylesCard.card}>
      <Img url={url} />
      <div className={stylesCard.cardContent}>
        <div className={stylesCard.cardInfo}>
          <HighestBidInfo auctionContract={auctionContract} />
          <TimeLeft auctionContract={auctionContract} allowBid={allowBid} />
        </div>
        <div className={stylesCard.actionsContainer}>
          {isOwnerOfAuction ?
            <OwnerActions auctionContract={auctionContract} /> :
            <BidButton auctionContract={auctionContract} disabled={!canBid} />
          }
        </div>
      </div>
    </div>
  )
};

export default AuctionCard;
