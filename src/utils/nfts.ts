import { PublicKey } from "@solana/web3.js";
import { DAS, Helius } from "helius-sdk";
import { CheckedNft } from "../data/types";

export const checkNfts = async (mintList: string[]) => {
  let paginationToken: string | null = null;
  const allCheckedNfts: CheckedNft[] = [];

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
  let nfts: DAS.GetAssetResponse[] = [];

  nfts = await getAssetsByOwner(owner.toBase58());

  if (allowedCollections && allowedCollections.length) {
    nfts = nfts.filter(
      (nft) =>
        (nft.grouping &&
          allowedCollections.includes(nft.grouping[0]?.group_value)) ||
        (nft.creators &&
          nft.creators.find((c) => c.verified)?.address &&
          allowedCollections.includes(
            nft.creators?.find((c) => c.verified)!.address
          ))
    );
  }

  const checkedNfts = await checkNfts(
    nfts.filter((nft) => !nft.compression?.compressed).map((nft) => nft.id)
  );

  const combinedArray = nfts.map((nft) => {
    const matchingResult = checkedNfts.find(
      (result: CheckedNft) => result.mint === nft.id
    );
    return { ...nft, renaissance: matchingResult };
  });

  return combinedArray;
};

// export const getAssetsByOwner = async (owner: string) => {
//   const sortBy = {
//     sortBy: "created",
//     sortDirection: "asc",
//   };
//   const limit = 1000;
//   const page = 1;
//   const before = "";
//   const after = "";
//   const { data } = await axios.post(import.meta.env.VITE_HELIUS_RPC_PROXY, {
//     jsonrpc: "2.0",
//     id: "my-id",
//     method: "getAssetsByOwner",
//     params: [owner, sortBy, limit, page, before, after],
//   });

//   return data.result.items;
// };

export const getAssetsByOwner = async (
  owner: string
): Promise<DAS.GetAssetResponse[]> => {
  const helius = new Helius(
    import.meta.env.VITE_HELIUS_API_KEY,
    "mainnet-beta"
  );
  const response = await helius.rpc.getAssetsByOwner({
    ownerAddress: owner,
    page: 1,
    limit: 1000,
  });

  return response.items;
};
