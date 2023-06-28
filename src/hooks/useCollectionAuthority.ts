import {
  query,
  collection,
  onSnapshot,
  orderBy,
  limit,
  DocumentData,
  where,
  getDocs,
} from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { useWallet } from "@solana/wallet-adapter-react";

const useAuthorityCollection = () => {
  const [authorityCollection, setAuthorityCollection] =
    useState<DocumentData | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { publicKey } = useWallet();

  useEffect(() => {
    setLoading(true);

    const searchCollection = async () => {
      setLoading(true);

      const collectionsRef = collection(db, "collections");
      const q = query(
        collectionsRef,
        where("authority", "==", publicKey!.toBase58()),
        limit(10)
      );

      try {
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAuthorityCollection(docs);
      } catch (error) {
        console.log(error);
        setError(true);
      }
      setLoading(false);
    };

    if (publicKey) {
      searchCollection();
    }
  }, [publicKey]);

  return {
    authorityCollection,
    loading,
    error,
  };
};

export default useAuthorityCollection;
