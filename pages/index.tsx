import { useContractKit } from "@celo-tools/use-contractkit";

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { connect, address } = useContractKit();
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

      <div className={styles.grid}>
        {address ? (
          <div>Connected to {address}</div>
        ) : (
          <button className={styles.button} onClick={connect}>
            Connect wallet
          </button>
        )}
      </div>
    </main>
  );
};

export default Home;
