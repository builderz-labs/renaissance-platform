import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { checkNftRes, checkNfts, getAssetsByOwner } from "../utils/nfts";

export default function useNfts(allowedCollections?: string[]) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(0);

  useEffect(() => {
    const fetchNfts = async () => {
      setLoading(true);
      setError(false);

      try {
        let nfts = await getAssetsByOwner(publicKey!.toBase58());

        if (allowedCollections && allowedCollections.length) {
          nfts = nfts.filter((nft: any) =>
            allowedCollections.includes(nft.grouping[0].address)
          );
        }

        console.log(nfts);

        const checkedNfts = await checkNfts(nfts.map((nft: any) => nft.id));

        const combinedArray = nfts.map((nft: any) => {
          const matchingResult = checkedNfts.find(
            (result: checkNftRes) => result.mint === nft.id
          );
          return { ...nft, ...matchingResult };
        });

        setNfts(combinedArray);
      } catch (error) {
        console.log(error);
        setError(true);
      }
      setLoading(false);
    };

    if (publicKey) {
      console.log("Fetching NFTs");
      fetchNfts();
    }
  }, [connection, publicKey, allowedCollections, fetchStatus]);

  const refetchNfts = () => {
    setFetchStatus((prev) => prev + 1);
  };

  return { nfts, loading, error, refetchNfts };
}
