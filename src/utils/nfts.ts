import { PublicKey } from "@solana/web3.js";
import axios from "axios";

export type checkNftRes = {
  mint: string;
  royaltiesPaid: boolean;
  royaltiesToPay: number;
  royaltiesPaidAmount: number;
  status: string;
};

export const checkNfts = async (mintList: string[]) => {
  let paginationToken: string | null = null;
  const allCheckedNfts: checkNftRes[] = [];

  do {
    const res: any = await fetch(
      "https://renaissance-api.builderzlabs.workers.dev/api/v1/checked-nfts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "renaissance-api-key": "b8e58b039e0ca09991ae6b1feb5c3123",
        },
        body: JSON.stringify({
          mints: mintList,
          paginationToken,
        }),
      }
    );

    const data: any = await res.json();
    const { checkedNfts, paginationToken: newPaginationToken } = data;

    allCheckedNfts.push(...checkedNfts);

    paginationToken = newPaginationToken;
  } while (paginationToken !== null);

  return allCheckedNfts;
};

export const getCheckedNftsForCollection = async (
  owner: PublicKey,
  allowedCollections?: string[]
) => {
  let nfts = [];

  nfts = await getAssetsByOwner("3YMqK9K5RtBMHUntwbWA92GV5Vj6DHx2cy5PGLE4gYjA");

  if (allowedCollections && allowedCollections.length) {
    nfts = nfts.filter(
      (nft: any) =>
        allowedCollections.includes(nft.grouping[0]?.group_value) ||
        allowedCollections.includes(
          nft.creators.find((c: any) => c.verified)?.address
        )
    );
  }

  const checkedNfts = await checkNfts(
    nfts
      .filter((nft: any) => !nft.compression.compressed)
      .map((nft: any) => nft.id)
  );

  const combinedArray = nfts.map((nft: any) => {
    const matchingResult = checkedNfts.find(
      (result: checkNftRes) => result.mint === nft.id
    );
    return { ...nft, renaissance: matchingResult };
  });

  return combinedArray;
};

export const getAssetsByOwner = async (owner: string) => {
  const sortBy = {
    sortBy: "created",
    sortDirection: "asc",
  };
  const limit = 1000;
  const page = 1;
  const before = "";
  const after = "";
  const { data } = await axios.post(import.meta.env.VITE_HELIUS_RPC_PROXY, {
    jsonrpc: "2.0",
    id: "my-id",
    method: "getAssetsByOwner",
    params: [owner, sortBy, limit, page, before, after],
  });

  return data.result.items;
};
