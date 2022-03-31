# Workshop: Interacting with the Celo Blockchain using our Contract Kit

At cLabs, we've developed 2 packages to make it easier to interact with contracts in the Celo Blockchain.

- `@celo/contractkit`: ContractKit is a library to help interact with the Celo blockchain and to integrate Celo Smart Contracts within their applications.
- `@celo-tools/use-contractkit`: a React hook for managing access to ContractKit with a built-in modal system for connecting to verious wallets

## What we'll work on

We've prepared the skeleton for an Auction house using Next.js. Don't worry if you're not familiar with it. We've tried to extract away everything that was next specific so you can focus on learning contract kit!

The app should allow you to see the auctions that exist, create an auction as well and place a bid. We've already created the smart contracts for it so you can focus on interacting with them using contract kit.

## Workshop Instruction

### 0. Clone the repo and get the app running

```sh
git clone git@github.com:celo-org/celo-connect-2022-applications-workshop.git
cd celo-connect-2022-applications-workshop
yarn
```

### 1. Add the contract kit provider

- Install the dependencies

```sh
  yarn add @celo-tools/use-contractkit @celo/contractkit
```

Go to `pages/_app.tsx` and add the ContractKitProvider.
`_app.tsx` is the entry point for Next.js apps
You'll need to import the `use-contractkit` and then add the `ContractKitProvider` to the root of the app.

```diff
+ import { Alfajores, ContractKitProvider } from "@celo-tools/use-contractkit";

function AppRoot({ Component, pageProps }: AppProps) {
  return (
+    <ContractKitProvider
+      dapp={{
+        name: "Celo Connect Dapp",
+        description: "My first dapp",
+        url: "https://celoconnect.com/",
+        icon: "https://celoconnect.com/wp-content/uploads/2022/02/cc-full-final.svg",
+      }}
+      network={Alfajores}
+    >
      <Layout>
        {/* In next, all the pages your create end up here? */}
        <Component {...pageProps} />
      </Layout>
+    </ContractKitProvider>
  );
}
```

### 2. Connect to wallet and show address

Now that you have wrapped your app with the `ContractKitProvider`, you can easily connect to a wallet and show the address/network using the `useContractKit` hook. This will be done in `Wallet` compononet.

You need to head over to `components/Wallet.tsx` and do the following simple steps:

- Import the `useContractKit` hook using `@celo-tools/use-contractkit`
- Substitute the placeholder values for the values returned by the hook!

```diff
+import { useContractKit } from "@celo-tools/use-contractkit";
import styles from "./Header.module.css";

export default function Wallet() {
-  const address = false;
-  const network = { name:'placeholder'};
-  const destroy = () => {};
-  const connect = () => {};
-  const kit = null;
+  const { kit, address, network, destroy, connect } = useContractKit();

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

```

And that's it! That's all you need to connect to a wallet.

`useContractKit` takes care of everything for you, including displaying the modal with the wallet option for the user to choose from!

You'll get to try it soon, but first, you need to have a Celo compatible wallet!

### 3. Fund your Metamask wallet with Celo so you can interact with the Auction House properly

- Make sure you have Metamask installed and unlocked. Copy your wallet address in your clipboard

- Add funds to it using the faucet https://celo.org/developers/faucet

### 4. Expose balance of different coins in the wallet

When clicking the connect button, `use-contractkit` should ask the user if they want to add the alfajores network as well as the different tokens (CELO, cUSD, cEUR, ...) to their wallet.

_However, as with all software... here is a backup plan:_

You can follow the guide here https://docs.celo.org/getting-started/wallets/using-metamask-with-celo/manual-setup#adding-a-celo-network-to-metamask to add manually the network and the tokens to Metamask.

```
Network Name: Celo (Alfajores Testnet)
New RPC URL: https://alfajores-forno.celo-testnet.org
Chain ID: 44787
Currency Symbol (Optional): CELO
Block Explorer URL (Optional): https://alfajores-blockscout.celo-testnet.org
```

### 5. Test your connect logic

- Try out the connect button to see if your address and funds shows up!

### 6. Get list of auctions

There are 2 contracts you'll need to interact with, the Auction Factory and the individual Auction one.
To get the list of current auctions, you'll need the Auction Factory.

Steps:

- Initialize the Auction Factory contract
- Use the allAuctions() method to get the existing auctions
- Check if there is a wallet connected by using kit

```diff
[...]

import AuctionFactoryABI from "../../contracts/build/AuctionFactory.json";
import { AuctionFactory } from "../../contracts/typings/AuctionFactory";

const abi = AuctionFactoryABI.abi as any;
const factoryContractAddress = AuctionFactoryABI.networks[Alfajores.chainId].address;

const AuctionGrid: React.FC = () => {
-  const kit = null;
+  const { kit } = useContractKit();
  const [auctions, setAuctions] = useState<string[]>([]);
  const [status, setStatus] = useState("idle");
  const refresh = useRefreshOnInterval(5000);

- const auctionFactoryContract = null;
+  const auctionFactoryContract = useMemo(
+    () => new kit.web3.eth.Contract(abi, factoryContractAddress),
+    [kit]
+  ) as unknown as AuctionFactory;

  useEffect(() => {
    const fetchAuctions = async () => {
+      if (!kit) return;
+
+      // Get all existing auctions with the method from the address
+      const allAuctionAdresses = await auctionFactoryContract.methods
+        .allAuctions()
+        .call();
+      setAuctions(allAuctionAdresses);
    };

    setStatus("loading");
    fetchAuctions()
      .then(() => setStatus("loaded"))
      .catch(() => setStatus("error"));
  }, [kit, auctionFactoryContract, refresh]);

- const isAccountConnected = false;
+  const isAccountConnected = kit && kit.defaultAccount;

  if (!isAccountConnected) {
    return (
      <div>
        <p>
          Connect your wallet to see your auctions.
        </p>
      </div>
    );
  }

  if (status === 'loaded' && auctions.length === 0) {
    return (
      <div>
        <p>
          No auctions yet.
        </p>
      </div>
    );
  }

  return (
    <>
    <CreateAuctionModal auctionFactoryContract={auctionFactoryContract} />
    <div className={styles.main}>
      {auctions.map((auctionAddress) => {
        return (
          <AuctionCard auctionContractAddress={auctionAddress} key={auctionAddress} />
        )
      })}
    </div>
    </>

  )
};

export default AuctionGrid;
```

### 7. Allow user to create auction

To get create a new auction, you'll need the Auction Factory contract. Fortunately, we already did this in step 6.
So we'll just forward it, via the `props` to our new component `CreateAuction.tsx`.

Steps:

- Check if there is a wallet connected by using kit
- Use performActions in use-contractkit
- Use the `auctionFactoryContract` to interact with the contract
- Use the `createAuction` method

```diff
const CreateAuctionModal = ({
  auctionFactoryContract,
}: {
  auctionFactoryContract: AuctionFactory;
}) => {
+ const { performActions } = useContractKit()
  const createAuction = async (imageUrl: string, bidTime = 5) => {
+    return (await performActions(async (kit) => {
+      if (!kit.defaultAccount) return;
+
+      const bidIncrement = 1; // baby bid
+      const auctionDurationInBlocks = Math.ceil(
+        (bidTime * MINUTE) / BLOCK_TIME
+      );
+
+      const createActionTx = auctionFactoryContract.methods.createAuction(
+        bidIncrement,
+        auctionDurationInBlocks,
+        imageUrl
+      );
+
+      const args = {
+        from: kit.defaultAccount,
+        data: createActionTx.encodeABI(),
+      };
+
+      const gas = await createActionTx.estimateGas(args);
+
+      return await kit.sendTransaction({ ...args, gas });
+    })) as TransactionResult[];

-   throw new Error('Unimplemented')
  };

  return <AuctionModal createAuction={createAuction} />;
};

export default CreateAuctionModal;

```

### 9. Show information of each auction

While we've done some of the heavy lifting, it's good to know how to gather data from a contract. This isn't strictly speaking related to `use-contractkit`, but this is useful knowledge nonetheless.

For instance, check the `components/Auction/AuctionCard.tsx` and implement `getAuctionData` the following way:

```diff
  useEffect(() => {
    const getAuctionData = async () => {
+      const [url, highestBidderAddress, highestBindingBid, owner] =
+        await Promise.all(
+          [
+            auctionContract.methods.imgUrl(),
+            auctionContract.methods.highestBindingBid(),
+            auctionContract.methods.highestBindingBid(),
+            auctionContract.methods.owner(),
+          ].map((x) => x.call())
+        );
+
+      setUrl(url);
+      setOwner(owner);
+      setHighestBidder(highestBidderAddress);
+      setHighestBid(highestBindingBid);
-      // Unimplemented
    };

    getAuctionData();
  }, [auctionContract]);
```

### 8. Allow user to bid on auction

Now, this whole auction house would be a bit useless if you couldn't bid on the auctioned items... So let's do this, shall we?

The file in question is located at `components/Auction/AuctionCardInfo/BidButton.tsx`

- As before you'll need the `Auction` contract, fortunately, we already provide it in the props
- Then use the `useContractKit` hook to be able to perform actions, such as signing a transaction.
- Use the `performActions` methods to wrap the contract's method `bidIncrement`

```diff
const BidButton = ({
  auctionContract,
  disabled,
}: {
  auctionContract: AuctionContract;
  disabled: boolean;
}) => {
+ const { performActions } = useContractKit();

  const bid = async () => {
+    await performActions(async (kit) => {
+      if (!kit.defaultAccount) return;
+
+      const bid = auctionContract.methods.placeBid();
+      const currentBid = await auctionContract.methods
+        .highestBindingBid()
+        .call();
+      const increment = new BigNumber(
+        await auctionContract.methods.bidIncrement().call()
+      );
+
+      const args = {
+        from: kit.defaultAccount,
+        data: bid.encodeABI(),
+        value: new BigNumber(currentBid).plus(increment).toString(),
+      };
+      const gas = await bid.estimateGas(args);
+
+      const transactionResult = await kit.sendTransaction({ ...args, gas });
+
+      await transactionResult.getHash();
+      await transactionResult.waitReceipt();
+    });
-    throw new Error("Unimplemented");
  };

  return (
    <button onClick={bid} disabled={disabled}>
      Bid
    </button>
  );
};

export default BidButton;
```

### 9. Build more!

Now the workshop has convered most bases, but there's still so much to learn! Head to https://docs.celo.org/developer-resources/use-contractkit to learn more. Including managing the available networks to the wallet, adjusting the feeCurrency to use cEUR or cUSD, and more!

If you are interested by the auction house contract, you can have a sneakpeek in the `contracts` folder. :)
