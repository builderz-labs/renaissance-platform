import { PublicKey } from "@solana/web3.js";
import axios from "axios";

export type checkNftRes = {
  mint: string;
  royaltiesPaid: boolean;
  royaltiesToPay: number;
  royaltiesPaidAmount: number;
  status: string;
};

// export const getNfts = async (owner: PublicKey) => {
//   const nfts = [];

//   try {
//     const url = `${
//       import.meta.env.VITE_HELIUS_RPC_PROXY
//     }/v0/addresses/${owner.toBase58()}/nfts?pageNumber=1`;

//     const { data } = await axios.get(url);
//     nfts.push(...data.nfts);

//     for (let index = 2; index < data.numberOfPages + 1; index++) {
//       const { data } = await axios.get(
//         `${
//           import.meta.env.VITE_HELIUS_RPC_PROXY
//         }/v0/addresses/${owner.toBase58()}/nfts?pageNumber=${index}`
//       );
//       nfts.push(...data.nfts);
//     }

//     return nfts;
//   } catch (error) {
//     throw error;
//   }
// };

export const checkNfts = async (mintList: string[]) => {
  try {
    const res: checkNftRes[] = await (
      await fetch(
        "https://renaissance-api.builderzlabs.workers.dev/api/check-nfts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mints: mintList,
          }),
        }
      )
    ).json();

    return res;
  } catch (error) {
    throw error;
  }
};

export const getCheckedNftsForCollection = async (
  owner: PublicKey,
  allowedCollections?: string[]
) => {
  console.log(owner.toBase58());
  console.log(allowedCollections);

  let nfts = [];

  try {
    nfts = await getAssetsByOwner(owner.toBase58());

    if (allowedCollections && allowedCollections.length) {
      nfts = nfts.filter((nft: any) =>
        allowedCollections.includes(nft.grouping[0].address)
      );
    }

    console.log(nfts);

    const checkedNfts = await checkNfts(nfts.map((nft: any) => nft.id));

    const combinedArray = nfts.map((nft: any) => {
      const matchingResult = checkedNfts.find(
        (result: checkNftRes) => result.mint === nft.tokenAddress
      );
      return { ...nft, ...matchingResult };
    });

    return combinedArray;
  } catch (error) {
    throw error;
  }
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
    params: [
      owner, // "5AsKgxeYRaHRcZivZDXoCK6PmVCbc7Nnc4LURpBV7tPv",
      sortBy,
      limit,
      page,
      before,
      after,
    ],
  });

  return data.result.items;
};
