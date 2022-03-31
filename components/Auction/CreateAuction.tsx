import { useContractKit } from "@celo-tools/use-contractkit";

import AuctionModal from "../Base/AuctionModal";

// Types
import { ContractKit } from "@celo/contractkit";
import { AuctionFactory } from "../../contracts/typings/AuctionFactory";

const MINUTE = 60; // seconds
const BLOCK_TIME = 5; // seconds

export type TransactionResult = Awaited<
  ReturnType<ContractKit["sendTransaction"]>
>;

// In this component, we'll focus on building the action part.
// The logic and visual part of the modal itself has been abstracted into AuctionModal
// All you have to do is add an async function that will make the call to
// the smart contract using contractKit
const CreateAuctionModal = ({
  auctionFactoryContract,
}: {
  auctionFactoryContract: AuctionFactory;
}) => {
  const createAuction = async (imageUrl: string, bidTime = 5) => {
    throw new Error('Unimplemented')
  };

  return <AuctionModal createAuction={createAuction} />;
};

export default CreateAuctionModal;
