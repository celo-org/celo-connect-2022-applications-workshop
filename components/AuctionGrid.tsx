import styles from "./AuctionGrid.module.css"
import { useContractKit, Alfajores, UseContractKit } from "@celo-tools/use-contractkit";

import { useCallback, useEffect, useMemo, useState } from "react";
import useInterval from "../utils/use-interval";
import AuctionCard from "./AuctionCard";
import AuctionFactoryABI from "../build/contracts/AuctionFactory.json";
import { AuctionFactory } from "../contracts-typings/AuctionFactory";
import AuctionModal from "./AuctionModal";

const MINUTE = 60;

const getContract = (kit: UseContractKit['kit'], abi: any, address: string) => {
  return new kit.web3.eth.Contract(
    abi,
    address
  );
}

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

const abi = AuctionFactoryABI.abi;
const factoryContractAddress = AuctionFactoryABI.networks[Alfajores.chainId].address;

const AuctionGrid: React.FC = () => {
  const { kit } = useContractKit();
  const [auctions, setAuctions] = useState<string[]>([]);
  const [status, setStatus] = useState('idle')
  const [refresh, setRefresh] = useState({ refresh: false });

  // Initiate contract using ABI to have access to its methods
  const auctionFactoryContract = useMemo(() => getContract(kit, abi, factoryContractAddress),
    [kit]) as unknown as AuctionFactory;

  useInterval(() => setRefresh({ refresh: true }), 5000);

  useEffect(() => {
    const fetchAuctions = async () => {
      if (!kit) return;

      // Get all existing auctions with the method from the address
      const allAuctionAdresses = await auctionFactoryContract.methods.allAuctions().call();
      setAuctions(allAuctionAdresses);
    };

    setStatus('loading');
    fetchAuctions()
      .then(() => setStatus('loaded'))
      .catch(() => setStatus('error'));
  }, [kit, auctionFactoryContract, refresh]);


  // In the empty version of the app, we could show this
  // const isAccountConnected = false;
  const isAccountConnected = kit && kit.defaultAccount;

  if (!isAccountConnected) {
    return (
      <div>
        <p>
          Connect your wallet to see your auctions.
        </p>
      </div>
    );
  }

  if (status === 'loaded' && auctions.length === 0) {
    return (
      <div>
        <p>
          No auctions yet.
        </p>
      </div>
    );
  }

  return (
    <>
    <CreateAuctionModal auctionFactoryContract={auctionFactoryContract} />
    <div className={styles.main}>
      {auctions.map((auctionAddress) => {
        return (
          <AuctionCard auctionContractAddress={auctionAddress} key={auctionAddress} />
        )
      })}
    </div>
    </>

  )
};

export default AuctionGrid;
