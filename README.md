# Workshop: Interacting with the Celo Blockchain using Contract Kit

At cLabs, we've developed 2 packages to make it easier to interact with contracts in the Celo Blockchain.

- `@celo/contractkit`: ContractKit is a library to help interact with the Celo blockchain and to integrate Celo Smart Contracts within their applications.
- `@celo-tools/use-contractkit`: a React hook for managing access to ContractKit with a built-in modal system for connecting to various wallets.

## What we'll work on

We've prepared the skeleton for an Auction house using Next.js. Don't worry if you're not familiar with it. We've tried to extract away everything that was Next specific so you can focus on learning Contract Kit!

The app should allow you to see the auctions that exist, create an auction as well as place a bid. We've already created the smart contracts for it so you can focus on interacting with them using Contract Kit.

## Workshop Instruction

### 0. Clone the repo and get the app running

```sh
git clone git@github.com:celo-org/celo-connect-2022-applications-workshop.git
cd celo-connect-2022-applications-workshop
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 1. Add the Contract Kit Provider

Go to `pages/_app.tsx` where you will add the `ContractKitProvider`.

Note: `_app.tsx` is the entry point for Next.js apps.

Steps:

- Import the `ContractKitProvider` using `use-contractkit`

```ts
import { Alfajores, ContractKitProvider } from "@celo-tools/use-contractkit";
```

- Add the `ContractKitProvider` to the root of the app

```ts
<ContractKitProvider
  dapp={{
    name: "Celo Connect Dapp",
    description: "My first dapp",
    url: "https://celoconnect.com/",
    icon: "https://celoconnect.com/wp-content/uploads/2022/02/cc-full-final.svg",
  }}
  network={Alfajores}
>
// Existing AppRoot code
</ContractKitProvider>
```

---
<details>
<summary>See expected diff from changes</summary>

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
        <Wallet />
        <Spacer axis="vertical" size={32} />
        {/* In next, all the pages created within `/pages` can be accessed by its name
          and are displayed here */}
        <Component {...pageProps} />
      </Layout>
+    </ContractKitProvider>
  );
}
```

</details>

---

### 2. Add connect to wallet logic

Now that you have wrapped the app with the `ContractKitProvider`, you can easily connect to a wallet and show the address/network using the `useContractKit` hook. This will be done in `Wallet` component so head over to `components/Wallet.tsx`.

Now follow the steps:

- Import the `useContractKit` hook using `@celo-tools/use-contractkit`

```ts
import { useContractKit } from "@celo-tools/use-contractkit";
```

- Substitute the placeholder values for the values returned by the hook. The helper functions of `connect` and `destroy` are already used in the buttons to connect and disconnect from the wallet.

```ts
const { kit, address, network, destroy, connect } = useContractKit();
```

- Add the logic below to the `fetchSummary()` func to get the balance summary of the different coins supported by Celo.

> Note how the kit has access to the coins contracts without the need for any extra configuration.

```ts
if (!address) return;

const [goldToken, cUSD, cEUR] = await Promise.all([
  kit.contracts.getGoldToken(),
  kit.contracts.getStableToken(StableToken.cUSD),
  kit.contracts.getStableToken(StableToken.cEUR),
]);

const [celo, cusd, ceur] = await Promise.all([
  goldToken.balanceOf(address),
  cUSD.balanceOf(address),
  cEUR.balanceOf(address),
]);

setBalanceSummary({
  celo,
  cusd,
  ceur,
});
```

---
<details>

<summary>See expected diff from changes</summary>

```diff
+import { useContractKit } from "@celo-tools/use-contractkit";

[...]
 export default function Wallet() {
-  const address = false;
-  const network = { name: "placeholder" };
-  const destroy = () => {};
-  const connect = () => {};
-  const kit = null;
+  const { kit, address, network, destroy, connect } = useContractKit();
   const [balanceSummary, setBalanceSummary] = useState(DEFAULT_BALANCE_SUMMARY);
   // Small workaround for next.js to not complain about a missing div from server rendering.
   const [walletAddress, setWalletAddress] = useState<string | null>("");

   export default function Wallet() {
     setWalletAddress(address);

     const fetchSummary = async () => {
-      // Unimplemented
+      if (!address) return;
+
+      const [goldToken, cUSD, cEUR] = await Promise.all([
+        kit.contracts.getGoldToken(),
+        kit.contracts.getStableToken(StableToken.cUSD),
+        kit.contracts.getStableToken(StableToken.cEUR),
+      ]);
+
+      const [celo, cusd, ceur] = await Promise.all([
+        goldToken.balanceOf(address),
+        cUSD.balanceOf(address),
+        cEUR.balanceOf(address),
+      ]);
+
+      setBalanceSummary({
+        celo,
+        cusd,
+        ceur,
+      });
     };

     fetchSummary();
[...]
```

</details>

---

And that's it - that's all you need to connect to a wallet.

`useContractKit` takes care of everything for you, including displaying the modal with the wallet option for the user to choose from!

You'll get to try it soon, but first, you need to have a Celo compatible wallet with funds.

### 3. Fund your Metamask wallet with Celo so you can interact with the Auction House properly

- Make sure you have Metamask installed and unlocked. Copy your wallet address in your clipboard.

- Add funds to it using the faucet https://celo.org/developers/faucet

### 4. Connect your wallet to the app

It's time to try out the `Connect wallet` button to see if your address and funds shows up!

- Check your terminal to make sure the app is running (run `yarn dev` again if it's not)
- Open the app in the browser (default address is http://localhost:3000)
- Click the `Connect wallet` button
- A modal should appear with the wallet options:
  - Choose Metamask
- Check that your address and your balance show up on the screen!

### 5. See the balance of different coins in your Metamask Wallet

When clicking the connect button, `use-contractkit` should ask the user if they want to add the Alfajores network as well as the different tokens (CELO, cUSD, cEUR, ...) to their wallet.

_However, as with all software... here is a backup plan:_

You can follow the guide here https://docs.celo.org/getting-started/wallets/using-metamask-with-celo/manual-setup#adding-a-celo-network-to-metamask to add manually the network and the tokens to Metamask.

```text
Network Name: Celo (Alfajores Testnet)
New RPC URL: https://alfajores-forno.celo-testnet.org
Chain ID: 44787
Currency Symbol (Optional): CELO
Block Explorer URL (Optional): https://alfajores-blockscout.celo-testnet.org
```

### 6. Get the list of auctions

Now that you have connected your wallet, let's move on to actually working on the Auction.

There are 2 contracts you'll need to interact with: the Auction Factory (which is responsible for creating an `Auction`) and the individual Auction one.

To retrieve the list of existing auctions, you'll need to use the Auction Factory in the `AuctionGrid` component (found in `components/Auction/AuctionGrid.tsx`).

For that, follow the steps:

- Initialize the Auction Factory contract:
  - Replace `const kit` with the `useContractKit` hook

    ```ts
    const { kit } = useContractKit();
    ```

  - Get and assign the `AuctionFactory` contract to `const auctionFactoryContract` using `web3`

    ```ts
    const auctionFactoryContract = useMemo(
      () => new kit.web3.eth.Contract(abi, factoryContractAddress),
      [kit]
    ) as unknown as AuctionFactory;
    ```

    > Note 1: We suggest using `useMemo` because (1) `auctionFactoryContract` is used in the `useEffect` dependency array of a child component and (2) we are refetching the list every 5 seconds.
    ---
    > Note 2: To make this and the next step easier, we've already imported the Contract ABI (`AuctionFactoryABI`) and its typings (`AuctionFactory`), which includes the methods that the contract has.

- Once the contract has been initialised, you can use its `allAuctions()` method to get the existing auctions

```ts
if (!kit) return;

// Get all existing auctions with the method from the address
const allAuctionAdresses = await auctionFactoryContract.methods
  .allAuctions()
  .call();

setAuctions(allAuctionAdresses);
```

- Finally, use `kit` to check if there is a wallet connected before showing auctions

```ts
const isAccountConnected = kit && kit.defaultAccount;
```

---
<details>

<summary>See expected diff from changes</summary>

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

  [...]
};

export default AuctionGrid;
```
</details>

---

### 7. Allow users to create an auction

To get create a new auction, you'll need the Auction Factory contract. Fortunately, we already did this in step 6.
So we'll just forward it, via the `props` to our new component `CreateAuction.tsx`.

Steps:

- Check if there is a wallet connected by using kit
- Use performActions in use-contractkit
- Use the `auctionFactoryContract` to interact with the contract
- Use the `createAuction` method

```ts
const { performActions } = useContractKit();
const createAuction = async (imageUrl: string, bidTime = 5) => {
  return (await performActions(async (kit) => {
    if (!kit.defaultAccount) return;

    const bidIncrement = 1; // baby bid
    const auctionDurationInBlocks = Math.ceil((bidTime * MINUTE) / BLOCK_TIME);

    const createActionTx = auctionFactoryContract.methods.createAuction(
      bidIncrement,
      auctionDurationInBlocks,
      imageUrl
    );

    const args = {
      from: kit.defaultAccount,
      data: createActionTx.encodeABI(),
    };

    const gas = await createActionTx.estimateGas(args);

    return await kit.sendTransaction({ ...args, gas });
  })) as TransactionResult[];
};
```

---

<details>

<summary>See expected diff from changes</summary>

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

</details>

---

### 8. Show information about each auction

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

### 9. Allow users to bid on auction

Now, this whole auction house would be a bit useless if you couldn't bid on the auctioned items... So let's do this, shall we?

The file in question is located at `components/Auction/AuctionCardInfo/BidButton.tsx`

- As before you'll need the `Auction` contract, fortunately, we have already provided it in the props
- Then use the `useContractKit` hook to be able to perform actions, such as signing a transaction.
- Use the `performActions` methods to wrap the contract's method `bidIncrement`

```ts
const { performActions } = useContractKit();

const bid = async () => {
  await performActions(async (kit) => {
    if (!kit.defaultAccount) return;

    const bid = auctionContract.methods.placeBid();
    const currentBid = await auctionContract.methods.highestBindingBid().call();
    const increment = new BigNumber(
      await auctionContract.methods.bidIncrement().call()
    );

    const args = {
      from: kit.defaultAccount,
      data: bid.encodeABI(),
      value: new BigNumber(currentBid).plus(increment).toString(),
    };
    const gas = await bid.estimateGas(args);

    const transactionResult = await kit.sendTransaction({ ...args, gas });

    await transactionResult.getHash();
    await transactionResult.waitReceipt();
  });
};
```

---

<details>

<summary>See expected diff from changes</summary>

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

</details>

---

### 10. Build more!

Now the workshop has covered most bases, but there's still so much to learn! Head to https://docs.celo.org/developer-resources/use-contractkit to learn more. Including managing the available networks to the wallet, adjusting the feeCurrency to use cEUR or cUSD, and more!

If you are interested in the auction house contract, you can have a sneakpeek in the `contracts` folder. :)
