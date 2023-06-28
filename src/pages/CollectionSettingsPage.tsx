import { useWallet } from "@solana/wallet-adapter-react";
import styled from "styled-components";
import MyMultiButton from "../components/MyMultiButton";
import { CollectionSettings } from "../components/CollectionSettings";

const Blur1 = styled.div`
  background: linear-gradient(180deg, #e6813e 0%, #00b2ff 100%);
  filter: blur(50.5px);
  width: 260px;
  height: 260px;
`;

export const CollectionSettingsPage = () => {
  const wallet = useWallet();

  return (
    <div className="h-full relative mb-40 text-start">
      <Blur1 className="absolute -top-40 -right-40 z-0 opacity-20" />
      <Blur1 className="absolute top-40 right-40 z-0 opacity-10" />
      <Blur1 className="absolute top-80 -right-60 z-0 opacity-20" />
      <section className="my-5 ">
        <h1 className="text-4xl font-bold mb-16 ">Your Collections</h1>
        {wallet.publicKey ? (
          <>
            <CollectionSettings />
          </>
        ) : (
          <div className="w-full flex items-center justify-center flex-col gap-4">
            <p>Please connect your wallet:</p>
            <MyMultiButton />
          </div>
        )}
      </section>
    </div>
  );
};
