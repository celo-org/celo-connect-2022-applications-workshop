import BigNumber from "bignumber.js";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Auction as AuctionContract } from "../../../contracts/typings/Auction";

const BidButton = ({
  auctionContract,
  disabled,
}: {
  auctionContract: AuctionContract;
  disabled: boolean;
}) => {
  const bid = async () => {
    throw new Error("Unimplemented");
  };

  return (
    <button onClick={bid} disabled={disabled}>
      Bid
    </button>
  );
};

export default BidButton;
