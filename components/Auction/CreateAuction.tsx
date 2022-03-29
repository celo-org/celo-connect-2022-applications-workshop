import { useContractKit } from "@celo-tools/use-contractkit";

import AuctionModal from "../Base/AuctionModal";

// Types
import { ContractKit } from "@celo/contractkit";
import { AuctionFactory } from "../../contracts-typings/AuctionFactory";

const MINUTE = 60;

export type TransactionResult = Awaited<ReturnType<ContractKit['sendTransaction']>>;

// In this component, we'll focus on building the action part.
// The logic and visual part of the modal itself has been abstracted into AuctionModal
// All you have to do is add an async function that will make the call to
// the smart contract using contractKit
const CreateAuctionModal = ({ auctionFactoryContract }: {auctionFactoryContract: AuctionFactory }) => {
  const { performActions } = useContractKit();

  const createAuction = async (imageUrl: string, bidTime = 5) => {
      return await performActions(async (kit) => {
        if (!kit.defaultAccount) return;

        const currentBlock = (await kit.web3.eth.getBlockNumber()) + 10; // add two block padding
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

        return await kit.sendTransaction({ ...args, gas });
      }) as TransactionResult[];
    };

  return (
    <AuctionModal createAuction={createAuction} />
  )
};

export default CreateAuctionModal;
