import styles from "./Home.module.css";
import { useContractKit } from "@celo-tools/use-contractkit";
import { StableToken } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import isURL from "validator/lib/isURL";

import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Auction } from "../utils/auction";
import useInterval from "../utils/use-interval";
import AuctionTable from "../components/Initial/AuctionTable";
import AuctionModal from "../components/Base/AuctionModal";
import { auctionHouseFactory } from "../utils/auction_house";
import { TransactionResult } from "../components/Auction/CreateAuction";

const MINUTE = 60; // seconds
const BLOCK_TIME = 5; // seconds

const Home: NextPage = () => {
  const { kit, performActions } = useContractKit();
  const [auctions, setAuctions] = useState<Auction[]>([]);

  const fetchAuctions = useCallback(async () => {
    if (!kit) return;

    const allAuctionAdresses = await auctionHouseFactory(kit)
      .methods.allAuctions()
      .call();
    const allAuctions = allAuctionAdresses.map(
      (address) => new Auction(kit, address)
    );

    setAuctions(allAuctions);
  }, [kit]);

  const createAuction = useCallback(
    (imageUrl: string, bidTime = 5) => {
      if (!isURL(imageUrl)) throw new Error("An image URL must be provided");

      return performActions(async (k) => {
        if (!k.defaultAccount) return;

        const auction = auctionHouseFactory(k).methods.createAuction(
          1, // baby bid
          Math.ceil((bidTime * MINUTE) / BLOCK_TIME),
          imageUrl
        );
        const args = {
          from: k.defaultAccount,
          data: auction.encodeABI(),
        };
        const gas = await auction.estimateGas(args);

        setTimeout(() => fetchAuctions(), 5000);
        return k.sendTransaction({ ...args, gas });
      }) as Promise<TransactionResult[]>;
    },
    [performActions, fetchAuctions]
  );

  const bid = useCallback(
    (auctionAddress: string) => {
      if (!auctionAddress) throw new Error(`No address provided`);

      const auction = auctions.find((x) => x.address === auctionAddress);
      if (!auction) throw new Error(`Unknown auction ${auctionAddress}`);

      return performActions(async (k) => {
        if (!k.defaultAccount) return;

        const bid = auction.contract.methods.placeBid();
        const currentBid = await auction.contract.methods
          .highestBindingBid()
          .call();
        const increment = new BigNumber(
          await auction.contract.methods.bidIncrement().call()
        );

        const args = {
          from: k.defaultAccount,
          data: bid.encodeABI(),
          value: new BigNumber(currentBid).plus(increment).toString(),
        };
        const gas = await bid.estimateGas(args);

        return k.sendTransaction({ ...args, gas });
      }) as Promise<TransactionResult[]>;
    },
    [performActions, auctions]
  );

  const withdraw = useCallback(
    (auctionAddress: string) => {
      if (!auctionAddress) throw new Error(`No address provided`);

      const auction = auctions.find((x) => x.address === auctionAddress);
      if (!auction) throw new Error(`Unknown auction ${auctionAddress}`);

      return performActions(async (k) => {
        if (!k.defaultAccount) return;

        const data = await auction.getData();
        if (!Auction.canBeWithdrawn(k.defaultAccount, data)) return;

        const widthdraw = auction.contract.methods.withdraw();

        const args = {
          from: k.defaultAccount,
          data: widthdraw.encodeABI(),
        };
        const gas = await widthdraw.estimateGas(args);

        return k.sendTransaction({ ...args, gas });
      }) as Promise<TransactionResult[]>;
    },
    [performActions, auctions]
  );

  const cancel = useCallback(
    (auctionAddress: string) => {
      if (!auctionAddress) throw new Error(`No address provided`);

      const auction = auctions.find((x) => x.address === auctionAddress);
      if (!auction) throw new Error(`Unknown auction ${auctionAddress}`);

      return performActions(async (k) => {
        if (!k.defaultAccount) return;

        const data = await auction.getData();
        if (!Auction.isOwner(k.defaultAccount, data)) return;

        const cancel = auction.contract.methods.cancelAuction();

        const args = {
          from: k.defaultAccount,
          data: cancel.encodeABI(),
        };
        const gas = await cancel.estimateGas(args);

        return k.sendTransaction({ ...args, gas });
      }) as Promise<TransactionResult[]>;
    },
    [performActions, auctions]
  );

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);
  useInterval(fetchAuctions, 5000);

  // In the empty version of the app, we could show this
  // const isAccountConnected = false;

  const isAccountConnected = kit && kit.defaultAccount;

  return (
    <main className={styles.main}>
      {isAccountConnected ? (
        <div className={styles.section}>
          <AuctionTable
            auctions={auctions}
            bid={bid}
            withdraw={withdraw}
            cancel={cancel}
          />
          <AuctionModal createAuction={createAuction} />
        </div>
      ) : (
        <div className={styles.section}>
          Connect your wallet to see the running auctions and bid on them or
          even create your own!
        </div>
      )}
    </main>
  );
};

export default Home;
