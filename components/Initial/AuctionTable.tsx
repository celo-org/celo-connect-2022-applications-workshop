import React, { Fragment, useEffect, useState } from "react";
import type { Auction, AuctionData } from "../../utils/auction";
import AuctionRow from "./Auction";
import styles from "./AuctionTable.module.css";

export default function AuctionTable({
  auctions,
  bid,
  withdraw,
  cancel,
}: {
  auctions: Auction[];
  bid: (auctionAddress: string) => Promise<void>;
  withdraw: (auctionAddress: string) => Promise<void>;
  cancel: (auctionAddress: string) => Promise<void>;
}) {
  const [sorted, setSorted] = useState<[Auction, AuctionData][]>([]);

  useEffect(() => {
    void (async () => {
      const addressesWithEndBlocks = (await Promise.all(
        auctions.map(async (x) => [x, await x.getData()])
      )) as [Auction, AuctionData][];

      const sortedAuctions = addressesWithEndBlocks.sort(
        ([_a, aData], [_b, bData]) => {
          if (aData.canceledOrEnded === bData.canceledOrEnded) {
            if (aData.canceledOrEnded) {
              return bData.endBlock.minus(aData.endBlock).toNumber();
            }
            return aData.endBlock.minus(bData.endBlock).toNumber();
          }
          return aData.canceledOrEnded ? 1 : -1;
        }
      );
      setSorted(sortedAuctions);
    })();
  }, [auctions]);

  return (
    <table className={styles.auctionTable}>
      <thead>
        <tr>
          <th>Image</th>
          <th>Finishes in</th>
          <th>Current highest bid</th>
          <th>Current highest bidder</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(([_, data]) => (
          <Fragment key={data.address}>
            <AuctionRow
              data={data}
              bid={bid}
              withdraw={withdraw}
              cancel={cancel}
            />
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
