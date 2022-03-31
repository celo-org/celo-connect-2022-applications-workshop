import { StableToken } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { Balance } from "../Base/Balance";
import styles from "./Wallet.module.css";

const DEFAULT_BALANCE_SUMMARY = {
  celo: new BigNumber(0),
  cusd: new BigNumber(0),
  ceur: new BigNumber(0),
};

export default function Wallet() {
  const address = false;
  const network = { name:'placeholder'};
  const destroy = () => {};
  const connect = () => {};
  const kit = null;
  const [balanceSummary, setBalanceSummary] = useState(DEFAULT_BALANCE_SUMMARY);
  // Small workaround for next.js to not complain about a missing div from server rendering.
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }

    const fetchSummary = async () => {
      if (!address) return;

      const [goldToken, cUSD, cEUR] = await Promise.all([
        kit.contracts.getGoldToken(),
        kit.contracts.getStableToken(StableToken.cUSD),
        kit.contracts.getStableToken(StableToken.cEUR),
      ]);

      const [celo, cusd, ceur] = await Promise.all([
        goldToken.balanceOf(address),
        cUSD.balanceOf(address),
        cEUR.balanceOf(address),
      ]);

      setBalanceSummary({
        celo,
        cusd,
        ceur,
      });
    };

    fetchSummary();
  }, [kit, address]);

  return (
    <div className={styles.walletContainer}>
      {walletAddress ? (
        <>
          <div className={styles.summary}>
            <p className={styles.networkTag}>
              {`Connected to ${network.name}`}
            </p>
            <code>{`Address: ${address}`}</code>
            <Balance {...balanceSummary} />
          </div>
          <button className={styles.disconnectWalletButton} onClick={destroy}>
            Disconnect wallet
          </button>
        </>
      ) : (
        <button onClick={connect}>Connect wallet</button>
      )}
    </div>
  );
}
