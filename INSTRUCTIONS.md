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

- Try out the connect button to see if your address and funds shows up!

### 4. Expose balance of different coins in the wallet

// TODO: Add instructions? If the workshop ends up too large, we could not include this.

### 5. Get list of auctions

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
+  const { kit } = useContractKit();
  const [auctions, setAuctions] = useState<string[]>([]);
  const [status, setStatus] = useState('idle')
  const [refresh, setRefresh] = useState({ refresh: false });

  // Initiate contract using ABI to have access to its methods
+  const auctionFactoryContract = useMemo(() => new kit.web3.eth.Contract(
+      abi,
+      factoryContractAddress
+    ),
+    [kit]) as unknown as AuctionFactory;

  useInterval(() => setRefresh({ refresh: true }), 5000);

  useEffect(() => {
    const fetchAuctions = async () => {
+      if (!kit) return;

+      // Get all existing auctions with the method from the address
+      const allAuctionAdresses = await auctionFactoryContract.methods.allAuctions().call();
+      setAuctions(allAuctionAdresses);
    };

    setStatus('loading');
    fetchAuctions()
      .then(() => setStatus('loaded'))
      .catch(() => setStatus('error'));
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

### 6. Allow user to create auction

// TODO: Add instruction

- Use performActions in use-contractkit
- Import CreateAuctionModal to AuctionGrid

```
<CreateAuctionModal auctionFactoryContract={auctionFactoryContract} />
```

### 7. Allow user to bid on auction

// TODO: Add instruction
