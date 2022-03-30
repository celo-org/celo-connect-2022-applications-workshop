import styles from "./AuctionTimeLeft.module.css";
import { AuctionStatus } from "../Auction/AuctionCard";

const AuctionTimeLeft = ({
  timeLeft,
  auctionStatus,
}: {
  timeLeft: number;
  auctionStatus: AuctionStatus;
}) => {
  let getStatusText = `🕙 ${Math.round(timeLeft / 60)} minutes left`;
  if (auctionStatus === AuctionStatus.CANCELED) {
    getStatusText = "❌ Auction Closed";
  }
  if (auctionStatus === AuctionStatus.ENDED) {
    getStatusText = "⌛️ Auction Ended";
  }

  return <div className={styles.auctionStatus}>{getStatusText}</div>;
};

export default AuctionTimeLeft;
