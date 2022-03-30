import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
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
        <a
          href="https://github.com/celo-org/use-contractkit"
          target="_blank"
          rel="noreferrer"
        >
          <h2>Documentation</h2>
        </a>
        <a
          href="https://alfajores-blockscout.celo-testnet.org/"
          target="_blank"
          rel="noreferrer"
        >
          <h2>Block Explorer</h2>
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
