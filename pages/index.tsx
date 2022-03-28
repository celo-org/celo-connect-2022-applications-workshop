import styles from "./Home.module.css";
import { useContractKit } from "@celo-tools/use-contractkit";
import { StableToken } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import isURL from "validator/lib/isURL";

import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { auctionHouse } from "../utils/auction_house";
import { Auction } from "../utils/auction";
import useInterval from "../utils/use-interval";
import AuctionTable from "../components/Initial/AuctionTable";
import AuctionModal from "../components/Base/AuctionModal";

const MINUTE = 60;

const Home: NextPage = () => {
  const { kit, connect, walletType, performActions } = useContractKit();
  const [auctions, setAuctions] = useState<Auction[]>([]);

  const fetchAuctions = useCallback(async () => {
    if (!kit) return;

    const allAuctionAdresses = await auctionHouse.methods.allAuctions().call();
    const allAuctions = allAuctionAdresses.map(
      (address) => new Auction(kit, address)
    );

    setAuctions(allAuctions);
  }, [kit]);

  const createAuction = useCallback(
    async (imageUrl: string, bidTime = 5) => {
      if (!isURL(imageUrl)) return;

      await performActions(async (k) => {
        if (!k.defaultAccount) return;

        const currentBlock = (await k.web3.eth.getBlockNumber()) + 2; // add two block padding
        const endingBlock = Math.ceil(currentBlock + (bidTime * MINUTE) / 5);
        const auction = auctionHouse.methods.createAuction(
          1, // baby bid
          currentBlock,
          endingBlock,
          imageUrl
        );
        const args = {
          from: k.defaultAccount,
          data: auction.encodeABI(),
        };
        const gas = await auction.estimateGas(args);

        setTimeout(() => fetchAuctions(), 5000);
        return k.sendTransaction({ ...args, gas });
      });
    },
    [performActions, fetchAuctions]
  );

  const bid = useCallback(
    async (auctionAddress: string) => {
      if (!auctionAddress) return;
      const auction = auctions.find((x) => x.address === auctionAddress);
      if (!auction) return;

      await performActions(async (k) => {
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
      });
    },
    [performActions, auctions]
  );

  const withdraw = useCallback(
    async (auctionAddress: string) => {
      if (!auctionAddress) return;
      const auction = auctions.find((x) => x.address === auctionAddress);
      if (!auction) return;

      await performActions(async (k) => {
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
      });
    },
    [performActions, auctions]
  );

  const cancel = useCallback(
    async (auctionAddress: string) => {
      if (!auctionAddress) return;
      const auction = auctions.find((x) => x.address === auctionAddress);
      if (!auction) return;

      await performActions(async (k) => {
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
      });
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
