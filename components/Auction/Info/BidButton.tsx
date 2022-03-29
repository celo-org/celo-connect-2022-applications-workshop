import BigNumber from "bignumber.js";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Auction as AuctionContract } from "../../../contracts-typings/Auction";

const BidButton = ({ auctionContract, refresh, ...props } : { auctionContract: AuctionContract, [x:string]: any }) => {
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

      const transactionResult = await kit.sendTransaction({ ...args, gas });

      await transactionResult.getHash();
      await transactionResult.waitReceipt();
    });
  };

  return (
    <button onClick={bid} {...props}>Bid</button>
  );
};

export default BidButton;
