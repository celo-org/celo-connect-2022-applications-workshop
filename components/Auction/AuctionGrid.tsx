import styles from "./AuctionGrid.module.css"
import { useContractKit, Alfajores } from "@celo-tools/use-contractkit";
import { useEffect, useMemo, useState } from "react";

import useInterval from "../../utils/use-interval";
import AuctionCard from "./AuctionCard";
import CreateAuctionModal from "./CreateAuction";

import AuctionFactoryABI from "../../build/contracts/AuctionFactory.json";
import { AuctionFactory } from "../../contracts-typings/AuctionFactory";

const abi = AuctionFactoryABI.abi as any;
const factoryContractAddress = AuctionFactoryABI.networks[Alfajores.chainId].address;

const AuctionGrid: React.FC = () => {
  const { kit } = useContractKit();
  const [auctions, setAuctions] = useState<string[]>([]);
  const [status, setStatus] = useState('idle')
  const [refresh, setRefresh] = useState({ refresh: false });

  const auctionFactoryContract = useMemo(() => new kit.web3.eth.Contract(
      abi,
      factoryContractAddress
    ),
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
