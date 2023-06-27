import * as React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function MyMultiButton() {
  return (
    <div className="ml-4">
      <WalletMultiButton className="btn !rounded-none hover:scale-105" />
    </div>
  );
}
