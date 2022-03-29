import { ContractKit } from "@celo/contractkit";
import { AuctionFactory } from "../contracts/typings/AuctionFactory";
import AuctionFactoryABI from "../contracts/build/AuctionFactory.json";
import { Alfajores } from "@celo-tools/use-contractkit";

export function auctionHouseFactory(kit: ContractKit): AuctionFactory {
  // @ts-expect-error
  return new kit.web3.eth.Contract(
    // @ts-expect-error
    AuctionFactoryABI.abi,
    // You could use String(await kit.connection.chainId()) here, but we only
    // want to work with alfajores in this project
    AuctionFactoryABI.networks[Alfajores.chainId].address
  ) as AuctionFactory;
}
