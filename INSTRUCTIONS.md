# Workshop: Interacting with the Celo Blockchain using our Contract Kit

At cLabs, we've developed 2 packages to make it easier to interact with contracts in the Celo Blockchain.

- `@celo/contractkit`: TODO: add small explanation
- `@celo-tools/use-contractkit`: TODO: add small explanation

## What we'll work on

We've prepared the skeleton for an Auction house using Next.js. Don't worry if you're not familiar with it. We've tried to extract away everything that was next specific so you can focus on learning contract kit!

The app should allow you to see the auctions that exist, create an auction as well and place a bid. We've already created the smart contracts for it so you can focus on interacting with them using contract kit.

## Steps

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

### 2. Connect to wallet?
