import { StableToken, Token } from "@celo/contractkit";
import Image from "next/image";

import CeloIcon from "/components/Base/TokenIcon/CELO.svg";
import cEURIcon from "/components/Base/TokenIcon/cEUR.svg";
import cREALIcon from "/components/Base/TokenIcon/cREAL.svg";
import cUSDIcon from "/components/Base/TokenIcon/cUSD.svg";

import React from "react";

type TokenType = keyof typeof StableToken | keyof typeof Token;

const customStyle = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  color: "grey",
};

export const TokenIcon = ({ tokenType }: { tokenType: TokenType }) => {
  let icon: string = "";
  switch (tokenType) {
    case StableToken.cUSD:
      icon = cUSDIcon;
      break;
    case StableToken.cEUR:
      icon = cEURIcon;
      break;
    case StableToken.cREAL:
      icon = cREALIcon;
      break;
    case Token.CELO:
      icon = CeloIcon;
      break;
    default:
      break;
  }

  return !!icon ? (
    <div style={customStyle}>
      <Image src={icon} alt={tokenType} width={20} height={20} />
      <span>{tokenType}</span>
    </div>
  ) : (
    <div></div>
  );
};

export default TokenIcon;
