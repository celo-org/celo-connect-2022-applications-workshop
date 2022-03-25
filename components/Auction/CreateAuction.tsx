import { useContractKit } from "@celo-tools/use-contractkit";

import { AuctionFactory } from "../../contracts-typings/AuctionFactory";
import AuctionModal from "../AuctionModal";

const MINUTE = 60;

// In this component, we'll focus on building the action part.
// The logic and visual part of the modal itself has been abstracted into AuctionModal
// All you have to do is add an async function that will make the call to
// the smart contract using contractKit
const CreateAuctionModal = ({ auctionFactoryContract }: {auctionFactoryContract: AuctionFactory }) => {
  const { performActions } = useContractKit();

  // TODO: Can the bid time be abstracted and not mentioned at all?
  const createAuction = async (imageUrl: string, bidTime = 5) => {
      await performActions(async (kit) => {
        if (!kit.defaultAccount) return;

        // TODO: Clarify what this part is for
        const currentBlock = (await kit.web3.eth.getBlockNumber()) + 2; // add two block padding
        const endingBlock = Math.ceil(currentBlock + (bidTime * MINUTE) / 5);
        const createActionTx = auctionFactoryContract.methods.createAuction(
          1, // baby bid
          currentBlock,
          endingBlock,
          imageUrl
        );

        const args = {
          from: kit.defaultAccount,
          data: createActionTx.encodeABI(),
        };

        const gas = await createActionTx.estimateGas(args);

        return kit.sendTransaction({ ...args, gas });
      });
    };

  return (
    <AuctionModal createAuction={createAuction} />
  )
};

export default CreateAuctionModal;
