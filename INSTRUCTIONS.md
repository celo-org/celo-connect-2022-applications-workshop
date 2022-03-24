# Workshop: Interacting with the Celo Blockchain using our Contract Kit

At cLabs, we've developed 2 packages to make it easier to interact with contracts in the Celo Blockchain.

- `@celo/contractkit`: TODO: add small explanation
- `@celo-tools/use-contractkit`: TODO: add small explanation

## What we'll work on

We've prepared the skeleton for an Auction house using Next.js. Don't worry if you're not familiar with it. We've tried to extract away everything that was next specific so you can focus on learning contract kit!

The app should allow you to see the auctions that exist, create an auction as well and place a bid. We've already created the smart contracts for it so you can focus on interacting with them using contract kit.


## Workshop Instruction

### 0. Clone the repo and get the app running

// TODO: Add instruction

### 1. Add the contract kit provider

- Install the dependencies

```sh
  yarn @celo-tools/use-contractkit @celo/contractkit
```

Go to `_app.tsx` and add the ContractKitProvider.
`_app.tsx` is the entry point for Next.js apps (?)
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


### 3. Fund your Metamask wallet with Celo so you can test your connect logic

- Set up a Metamask wallet to work with Celo:
// TODO: Add instruction of how to do that.

- Add funds to it using the faucet https://celo.org/developers/faucet

- Test using the connect button to see if your address shows up!
