import * as React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function MyMultiButton() {
  return (
    <div className="ml-4">
      <WalletMultiButton className="btn bg-renaissance-orange text-black hover:text-white  sm:w-[150px] md:w-auto  px-4 py-2 rounded-xl " />
    </div>
  );
}
