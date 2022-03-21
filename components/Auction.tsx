import { useContractKit } from "@celo-tools/use-contractkit";
import BigNumber from "bignumber.js";
import { formatDistance } from "date-fns";
import React, { useEffect, useState } from "react";
import Image from "react-image-enlarger";
import { Auction as AuctionClass, AuctionData } from "../utils/auction";

export default function Auction({
  data,
  bid,
  withdraw,
  cancel,
}: {
  data: AuctionData;
  bid: (auctionAddress: string) => Promise<void>;
  withdraw: (auctionAddress: string) => Promise<void>;
  cancel: (auctionAddress: string) => Promise<void>;
}) {
  const [zoomed, setZoomed] = useState(false);
  const { address } = useContractKit();

  const isOwner = data.owner.toUpperCase() === address?.toUpperCase();
  const hasBuyer = new BigNumber(data.highestBindingBid).gt(0);
  const isHighestBidder =
    data.highestBidder.toUpperCase() === address?.toUpperCase();
  const canWithdraw = AuctionClass.canBeWithdrawn(address!, data);

  let actions = null;

  if (isOwner) {
    if (!data.canceledOrEnded) {
      actions = (
        <button onClick={() => isOwner && cancel(data.address)}>Cancel</button>
      );
    } else {
      if (!data.canceled) {
        actions = hasBuyer ? (
          <span>GG! You sold this piece of art</span>
        ) : (
          <span>No bids recorded</span>
        );
      } else {
        actions = <span>You canceled this auction</span>;
      }
    }
  } else {
    if (data.canceledOrEnded) {
      if (canWithdraw) {
        actions = (
          <button onClick={() => canWithdraw && withdraw(data.address)}>
            Withdraw
          </button>
        );
      }
    } else {
      actions = (
        <button
          disabled={isHighestBidder}
          onClick={() => !isHighestBidder && bid(data.address)}
        >
          Bid
        </button>
      );
    }
  }

  return (
    <tr data-ended={data.canceledOrEnded ? "true" : ""}>
      <td>
        <Image
          style={{ width: "auto", height: "50px" }}
          zoomed={zoomed}
          src={data?.imgUrl}
          onClick={() => setZoomed(true)}
          onRequestClose={() => setZoomed(false)}
        />
      </td>
      <td>
        {data.canceledOrEnded ? (data.canceled ? "Canceled" : "Ended") : "Ends"}{" "}
        {formatDistance(data.endDate, new Date(), {
          includeSeconds: true,
          addSuffix: true,
        })}
      </td>
      <td>{data.highestBindingBid.toString()}</td>
      <td>
        {new BigNumber(data.highestBidder).eq(0) ? "-" : data.highestBidder}
      </td>
      <td>{actions}</td>
    </tr>
  );
}
