import styles from "./Base/Header.module.css";

export default function Wallet() {
  const address = false;
  const network = { name:'placeholder'};
  const destroy = () => {};
  const connect = () => {};

  return (
    <div className="container">
      {address ? (
        <>
          <div className={styles.summary}>
            <code>{`Network: ${network.name} | Address: ${address}`}</code>
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
