import { useContractKit } from "@celo-tools/use-contractkit";
import { StableToken } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { Balance } from "./Base/Balance";
import styles from "./Wallet.module.css";

const DEFAULT_BALANCE_SUMMARY = {
  celo: new BigNumber(0),
  cusd: new BigNumber(0),
  ceur: new BigNumber(0),
};

const normalizedBalance = (balance: BigNumber) => {
  return balance.dividedBy(10 ** 18).toFixed(2)
}

export default function Wallet() {
  const { kit, address, network, destroy, connect } = useContractKit();
  const [balanceSummary, setBalanceSummary] = useState(DEFAULT_BALANCE_SUMMARY);

  useEffect(() => {
    const fetchSummary = async () => {
      const address = kit.defaultAccount;
      if (!address) return;

      // There could be 2 separate steps in the workshop for the wallet part.
      // 1st is to check whether there's an address connected
      // and use the `connect` plus `address` that gets returned
      // from `useContractKit`.This will be literally a couple of lines.
      // It seemde that the summary from the accounts.getAccountSummary did
      // not give anything that `useContractKit` doesn't.
      // IMO it felt more powerful the fact that I don't have to do anything
      // other than use "connect" to get the address.
      // The 2nd step would be to then get the balance.

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
  }, [kit]);


  return (
    <div className={styles.walletContainer}>
      {address ? (
        <>
          <div className={styles.summary}>
            <p className={styles.networkTag}>{`Connected to ${network.name}`}</p>
            <code>{`Address: ${address}`}</code>
            <Balance {...balanceSummary} />
          </div>
          <button className={styles.redButton} onClick={destroy}>Disconnect wallet</button>
        </>
      ) : (
        <>
          <button className={styles.disconnectWalletButton} onClick={connect}>Connect wallet</button>
        </>
      )}
    </div>
  );
}
