// CSS Styles Import
import "../styles/globals.css";
import "@celo-tools/use-contractkit/lib/styles.css";

// Next specific
import type { AppProps } from "next/app";

import Layout from "../components/Base/Layout";
import Wallet from "../components/Wallet";
import { Alfajores, ContractKitProvider } from "@celo-tools/use-contractkit";

function AppRoot({ Component, pageProps }: AppProps) {
  return (
    <ContractKitProvider
      dapp={{
        name: "Celo Connect Dapp",
        description: "My first dapp",
        url: "https://celoconnect.com/",
        icon: "https://celoconnect.com/wp-content/uploads/2022/02/cc-full-final.svg",
      }}
      network={Alfajores}
    >
      <Layout>
        <Wallet />
        {/* In next, all the pages your create within `/pages` will be displayed here */}
        <Component {...pageProps} />
      </Layout>

    </ContractKitProvider>
  );
}

export default AppRoot;
