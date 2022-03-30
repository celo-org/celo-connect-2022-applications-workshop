import { Auction as AuctionContract } from "../../../contracts/typings/Auction";

const OwnerActions = ({
  auctionContract,
}: {
  auctionContract: AuctionContract;
}) => {
  /** TODO: Implement */
  return (
    <>
      <button>Cancel</button>
      <button>Withdraw</button>
    </>
  );
};

export default OwnerActions;
