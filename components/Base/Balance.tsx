import { StableToken, Token } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import TokenIcon from "./TokenIcon";
import styles from "./Balance.module.css";

const normalizedBalance = (balance: BigNumber) => {
  return balance.dividedBy(10 ** 18).toFixed(2);
};

export const Balance = ({
  celo,
  cusd,
  ceur,
}: {
  celo: BigNumber;
  cusd: BigNumber;
  ceur: BigNumber;
}) => {
  return (
    <div className={styles.balances}>
      <div className={styles.token}>
        <TokenIcon tokenType={Token.CELO} />
        {normalizedBalance(celo)}
      </div>
      <div className={styles.token}>
        <TokenIcon tokenType={StableToken.cEUR} />
        {normalizedBalance(ceur)}
      </div>
      <div className={styles.token}>
        <TokenIcon tokenType={StableToken.cUSD} />
        {normalizedBalance(cusd)}
      </div>
    </div>
  );
};
