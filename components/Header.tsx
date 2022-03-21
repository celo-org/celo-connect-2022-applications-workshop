import { useContractKit } from "@celo-tools/use-contractkit";
import { StableToken } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import Image from "next/image";
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
export default function Header() {
  const { kit, address, destroy, connect } = useContractKit();
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);

  const fetchSummary = useCallback(async () => {
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
  }, [kit]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <header className={styles.header}>
      <div>
        <Image
          src="/celo-connect.svg"
          alt="Conference Logo"
          width={144}
          height={144}
        />
      </div>
      <div>
        {address ? (
          <>
            <div className={styles.summary}>
              <code>{address}</code>
              <div className={styles.balances}>
                <code>{summary.celo.dividedBy(10 ** 18).toFixed(2)} CELO</code>
                <code>{summary.ceur.dividedBy(10 ** 18).toFixed(2)} cEUR</code>
                <code>{summary.cusd.dividedBy(10 ** 18).toFixed(2)} cUSD</code>
              </div>
            </div>
            <button onClick={destroy}>Disconnect wallet</button>
          </>
        ) : (
          <>
            <button onClick={connect}>Connect wallet</button>
          </>
        )}
        <a
          href="https://github.com/celo-org/use-contractkit"
          target="_blank"
          rel="noreferrer"
        >
          <h2>Documentation</h2>
        </a>
        <a
          href="https://celo.org/developers/faucet"
          target="_blank"
          rel="noreferrer"
        >
          <h2>Faucet</h2>
        </a>
      </div>
    </header>
  );
}
