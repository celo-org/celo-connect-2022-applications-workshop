import { useContractKit } from "@celo-tools/use-contractkit";
import { StableToken } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import styles from "./Header.module.css";

const DEFAULT_SUMMARY = {
  name: "",
  address: "",
  wallet: "",
  celo: new BigNumber(0),
  cusd: new BigNumber(0),
  ceur: new BigNumber(0),
};

const normalizedBalance = (balance: BigNumber) => {
  return balance.dividedBy(10 ** 18).toFixed(2)
}

export default function Wallet() {
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const { kit, address, destroy, connect } = useContractKit();

  useEffect(() => {
    const fetchSummary = async () => {
      const address = kit.defaultAccount;
      if (!address) return;

      const [accounts, goldToken, cUSD, cEUR] = await Promise.all([
        kit.contracts.getAccounts(),
        kit.contracts.getGoldToken(),
        kit.contracts.getStableToken(StableToken.cUSD),
        kit.contracts.getStableToken(StableToken.cEUR),
      ]);

      const [summary, celo, cusd, ceur] = await Promise.all([
        accounts.getAccountSummary(address).catch((e) => {
          console.error(e);
          return DEFAULT_SUMMARY;
        }),
        goldToken.balanceOf(address),
        cUSD.balanceOf(address),
        cEUR.balanceOf(address),
      ]);

      setSummary({
        ...summary,
        celo,
        cusd,
        ceur,
      });
    };

    fetchSummary();
  });


  return (
    <div className="container">
      {address ? (
        <>
          <div className={styles.summary}>
            <code>{address}</code>
            <div className={styles.balances}>
              <code>{normalizedBalance(summary.celo)} CELO</code>
              <code>{normalizedBalance(summary.ceur)} cEUR</code>
              <code>{normalizedBalance(summary.cusd)} cUSD</code>
            </div>
          </div>
          <button onClick={destroy}>Disconnect wallet</button>
        </>
      ) : (
        <>
          <button onClick={connect}>Connect wallet</button>
        </>
      )}
    </div>
  );
}
