import { ContractKit } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import AuctionABI from "../build/contracts/Auction.json";
import { Auction as AuctionContract } from "../contracts-typings/Auction";

export type AuctionData = {
  address: string;
  canceledOrEnded: boolean;
  canceled: boolean;
  ended: boolean;
  endBlock: BigNumber;
  endDate: Date;
  imgUrl: string;
  bidIncrement: BigNumber;
  highestBidder: string;
  highestBindingBid: BigNumber;
  owner: string;
  hasBid: BigNumber;
};
export class Auction {
  public contract: AuctionContract;
  constructor(private kit: ContractKit, public address: string) {
    // @ts-expect-error
    this.contract = new kit.web3.eth.Contract(
      // @ts-expect-error
      AuctionABI.abi,
      address
    ) as AuctionContract;
  }

  async hasBid(bidderAddress: string | undefined) {
    if (!bidderAddress) return new BigNumber(0);

    return new BigNumber(
      await this.contract.methods.fundsByBidder(bidderAddress).call()
    );
  }

  async getData(): Promise<AuctionData> {
    const [
      canceled,
      endBlockStr,
      imgUrl,
      bidIncrement,
      highestBidder,
      highestBindingBid,
      owner,
      hasBid,
    ] = await Promise.all([
      this.contract.methods.canceled().call(),
      this.contract.methods.endBlock().call(),
      this.contract.methods.imgUrl().call(),
      this.contract.methods.bidIncrement().call(),
      this.contract.methods.highestBidder().call(),
      this.contract.methods.highestBindingBid().call(),
      this.contract.methods.owner().call(),
      this.hasBid(this.kit.defaultAccount),
    ]);

    const endBlock = new BigNumber(endBlockStr);
    const currentBlock = await this.kit.web3.eth.getBlockNumber();
    const blockDiff = endBlock.minus(currentBlock);
    const secondsToEndBlock = blockDiff.multipliedBy(5).toNumber();

    this.contract.methods.withdraw;
    return {
      address: this.address,
      canceledOrEnded: canceled || endBlock.lt(currentBlock),
      canceled,
      ended: endBlock.lt(currentBlock),
      endBlock,
      endDate: new Date(Date.now() + secondsToEndBlock * 1000),
      imgUrl,
      bidIncrement: new BigNumber(bidIncrement),
      highestBidder: highestBidder.toUpperCase(),
      highestBindingBid: new BigNumber(highestBindingBid),
      owner: owner.toUpperCase(),
      hasBid,
    };
  }

  static canBeWithdrawn(bidderAddress: string, data: AuctionData) {
    if (!bidderAddress) return false;
    bidderAddress = bidderAddress.toUpperCase();

    const isOwner = this.isOwner(bidderAddress, data);
    const isHighestBidder = data.highestBidder === bidderAddress;
    let canWithdraw = false;
    if (data.canceled) {
      canWithdraw = !isOwner && data.hasBid.gt(0);
    } else if (data.ended) {
      canWithdraw = data.hasBid.gt(0) && (isOwner || !isHighestBidder);
    }

    return canWithdraw;
  }
  static isOwner(bidderAddress: string, data: AuctionData) {
    if (!bidderAddress) return false;
    bidderAddress = bidderAddress.toUpperCase();

    return data.owner === bidderAddress;
  }
}
