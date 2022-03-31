import "../styles/globals.css";
import "@celo-tools/use-contractkit/lib/styles.css";

import type { AppProps } from "next/app";

import Spacer from "../components/Base/Spacer";
import Layout from "../components/Base/Layout";
import Wallet from "../components/Wallet/Wallet";

function AppRoot({ Component, pageProps }: AppProps) {
  return (
      <Layout>
        <Wallet />
        <Spacer axis="vertical" size={32} />
        {/* In next, all the pages created within `/pages` can be accessed by its name
          and are displayed here */}
        <Component {...pageProps} />
      </Layout>
  );
}

export default AppRoot;
