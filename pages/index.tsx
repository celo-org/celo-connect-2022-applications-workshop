import { useContractKit } from "@celo-tools/use-contractkit";
import { StableToken } from "@celo/contractkit";
import BigNumber from "bignumber.js";

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "../styles/Home.module.css";

const DEFAULT_SUMMARY = {
  name: "",
  address: "",
  wallet: "",
  celo: new BigNumber(0),
  cusd: new BigNumber(0),
  ceur: new BigNumber(0),
};
const Home: NextPage = () => {
  const { kit, address, connect, walletType } = useContractKit();
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);

  const fetchSummary = useCallback(async () => {
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
  }, [kit, address]);

  useEffect(() => {
    void fetchSummary();
  }, [fetchSummary]);

  const ConnectedComponent = () => (
    <div>
      <div>Account summary</div>
      <div className="space-y-2">
        <div>Wallet type: {walletType}</div>
        <div>Name: {summary.name || "Not set"}</div>
        <div className="">Address: {address}</div>
        <div className="">
          Wallet address: {summary.wallet ? summary.wallet : "Not set"}
        </div>
      </div>
    </div>
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Welcome to the{" "}
        <a
          href="https://github.com/celo-org/use-contractkit"
          target="_blank"
          rel="noreferrer"
        >
          <code className={styles.code}>use-contractkit</code>
        </a>{" "}
        workshop
      </h1>

      {address ? (
        <ConnectedComponent />
      ) : (
        <button className={styles.button} onClick={connect}>
          Connect wallet
        </button>
      )}
    </main>
  );
};

export default Home;
