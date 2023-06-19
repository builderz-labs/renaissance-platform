import React from "react";
import { NftListRedemption } from "../project/NftListRedemption";

function NftContent({ pageCollection }: any) {
  return (
    <section className="my-4 text-start px-2 text-2xl font-bold flex flex-col gap-4 mt-10 relative">
      <h1>Your {pageCollection.id} NFTs</h1>
      <NftListRedemption pageCollection={pageCollection} />
    </section>
  );
}

export default NftContent;
