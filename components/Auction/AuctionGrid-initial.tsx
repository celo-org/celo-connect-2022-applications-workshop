import styles from "./AuctionGrid.module.css"
import { useContractKit, Alfajores } from "@celo-tools/use-contractkit";
import { useEffect, useMemo, useState } from "react";

import useInterval from "../../utils/use-interval";
import AuctionCard from "./AuctionCard";


const AuctionGrid: React.FC = () => {
  const { kit } = useContractKit();
  const [auctions, setAuctions] = useState<string[]>([]);
  const [status, setStatus] = useState('idle')
  const [refresh, setRefresh] = useState({ refresh: false });

  // Initiate contract using ABI to have access to its methods
  const auctionFactoryContract = ''; // TODO: uncomment and complete

  useInterval(() => setRefresh({ refresh: true }), 5000);

  useEffect(() => {
    const fetchAuctions = async () => {
      // TODO: Implement
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
    {/* Create Action Button goes here */}
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
