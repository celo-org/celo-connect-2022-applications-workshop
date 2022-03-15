import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
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

      <p className={styles.description}>
        Get started by editing{" "}
        <code className={styles.code}>pages/index.tsx</code>
      </p>

      <div className={styles.grid}></div>
    </main>
  );
};

export default Home;
