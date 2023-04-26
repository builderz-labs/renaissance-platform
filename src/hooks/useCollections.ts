import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAllCollection } from "../utils/collections";

export default function useCollections() {
  const { connection } = useConnection();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const getCollections = async () => {
      try {
        const collections = await getAllCollection();
        console.log(collections);

        // setCollections(collections);
      } catch (error) {
        console.log(error);
        setError(true);
      }
      setLoading(false);
    };

    if (connection) {
      getCollections();
    }
  }, [connection]);

  return { collections, loading, error };
}
