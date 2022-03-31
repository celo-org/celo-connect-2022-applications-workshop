import BigNumber from "bignumber.js";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";

import { Auction as AuctionContract } from "../../../contracts/typings/Auction";
import AuctionTimeLeft from "../../Base/AuctionTimeLeft";
import { AuctionStatus } from "../AuctionCard";

const TimeLeft = ({
  auctionContract,
  allowBid,
}: {
  auctionContract: AuctionContract;
  allowBid: (value: boolean) => void;
}) => {
  const { kit } = useContractKit();
  const [auctionStatus, setStatus] = useState<AuctionStatus>(
    AuctionStatus.ACTIVE
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const getStatus = async () => {
      const canceled = await auctionContract.methods.canceled().call();
      if (canceled) {
        setStatus(AuctionStatus.CANCELED);
        allowBid(false);
      }

      const endBlockInfo = await auctionContract.methods.endBlock().call();
      const currentBlock = await kit.web3.eth.getBlockNumber();
      const endBlock = new BigNumber(endBlockInfo);
      const hasEnded = endBlock.lt(currentBlock);
      if (hasEnded) {
        setStatus(AuctionStatus.ENDED);
        allowBid(false);
      }

      const blockDiff = endBlock.minus(currentBlock);
      const secondsToEndBlock = blockDiff.multipliedBy(5).toNumber();
      setTimeLeft(secondsToEndBlock);
    };

    getStatus();
  }, [auctionContract, kit, allowBid]);

  return <AuctionTimeLeft timeLeft={timeLeft} auctionStatus={auctionStatus} />;
};

export default TimeLeft;
