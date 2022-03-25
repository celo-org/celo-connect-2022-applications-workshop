import styles from "../pages/Home.module.css";
import stylesCard from "./AuctionCard.module.css"

import Image from "react-image-enlarger";

import BigNumber from "bignumber.js";
import { useContractKit, Alfajores, UseContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState, useMemo } from "react";

import AuctionABI from "../build/contracts/Auction.json";
import { Auction as AuctionContract } from "../contracts-typings/Auction";

// Extract into UTIL?
const getContract = (kit: UseContractKit['kit'], abi: any, address: string) => {
  return new kit.web3.eth.Contract(
    abi,
    address
  );
}

const BidButton = ({ auctionContract } : { auctionContract: AuctionContract }) => {
  const { performActions } = useContractKit();

  const bid = async () => {
    await performActions(async (kit) => {
      if (!kit.defaultAccount) return;

      const bid = auctionContract.methods.placeBid();
      const currentBid = await auctionContract.methods
        .highestBindingBid()
        .call();
      const increment = new BigNumber(
        await auctionContract.methods.bidIncrement().call()
      );

      const args = {
        from: kit.defaultAccount,
        data: bid.encodeABI(),
        value: new BigNumber(currentBid).plus(increment).toString(),
      };
      const gas = await bid.estimateGas(args);

      const result = await kit.sendTransaction({ ...args, gas });
      console.log('result', result);
    });
  };

  return (
    <button onClick={bid}>Bid</button>
  );
}

const OwnerActions = ({ auctionContract } : { auctionContract: AuctionContract }) => {
  return (
    <>
      <button>Cancel</button>
      <button>Withdraw</button>
    </>
  );
};

const HighestBidInfo = ({ auctionContract } : { auctionContract: AuctionContract }) => {
  const { address: walletAddress } = useContractKit();
  const [highestBidderAddress, setHighestBidderAddress] = useState<string>('');
  const [highestBid, setHighestBid] = useState<string>('');

  useEffect(() => {
    const getAuctionData = async () => {
      const highestBidderAddress = await auctionContract.methods.highestBidder().call();
      const highestBid = await auctionContract.methods.highestBindingBid().call();
      setHighestBidderAddress(highestBidderAddress);
      setHighestBid(highestBid);
    }

    getAuctionData();
  }, [auctionContract])

    const noBidder = new BigNumber(highestBidderAddress).eq(0);
    const bidAmount = noBidder ? "NO BID" : `${highestBid} CELO`;
    const shortenedBidderAddress = noBidder ? ''
      : 'from' + highestBidderAddress.substring(0, 5) + '...' + highestBidderAddress.substring(37 ,42);
    return (
      <div className={stylesCard.bidOffer}>
        <div className={stylesCard.bidTitle}>Highest offer</div>
        <div className={stylesCard.bid}>{bidAmount}</div>
        <div className={stylesCard.bidTitle}>{shortenedBidderAddress}</div>
      </div>
    );
}

const AuctionCard = ({ auctionContractAddress } : { auctionContractAddress: string }) => {
  const [url, setUrl] = useState('');
  const [owner, setOwner] = useState('');
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
      <div className={stylesCard.imageContainer}>
        {url === "" ? "Loading" : <img src={url} alt="Artwork for bid" width={400}/>}
      </div>
      <div className={stylesCard.cardInfo}>
        <HighestBidInfo auctionContract={auctionContract} />
          {/* <AuctionInfo  auctionContract={auctionContract}  owner={owner} /> */}
        <div className={stylesCard.actionsContainer}>
          {isOwnerOfAuction ?
            <OwnerActions auctionContract={auctionContract} /> :
            <BidButton auctionContract={auctionContract} owner={owner} />
          }
        </div>
      </div>
    </div>
  )
};

export default AuctionCard;
