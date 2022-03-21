import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import { AuctionFactory } from "../contracts-typings/AuctionFactory";
import AuctionFactoryABI from "../build/contracts/AuctionFactory.json";
import AuctionABI from "../build/contracts/Auction.json";
import { Alfajores } from "@celo-tools/use-contractkit";
import { Auction } from "../contracts-typings/Auction";

const web3 = new Web3(Alfajores.rpcUrl);
// @ts-expect-error
const kit = newKitFromWeb3(web3);
const networkId = Alfajores.chainId;
// @ts-expect-error
const auctionHouse: AuctionFactory = new kit.web3.eth.Contract(
  // @ts-expect-error
  AuctionFactoryABI.abi,
  AuctionFactoryABI.networks[networkId].address
);

export { auctionHouse };
